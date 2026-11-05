const NORMAL_DEPENDENCY_KIND = "normal";

/**
 * Returns whether cargo-mono can publish this package.
 *
 * Cargo metadata uses `null` when the manifest does not set `publish`, and an
 * empty array when the manifest sets `publish = false`.
 */
function isPublishable(pkg) {
  return pkg.publish == null || pkg.publish.length > 0;
}

function normalizePath(value) {
  return value.replaceAll("\\", "/").replace(/\/+$/, "");
}

function isAbsolutePath(value) {
  return value.startsWith("/") || /^[A-Za-z]:\//.test(value);
}

function resolveWorkspacePath(workspaceRoot, value) {
  const normalized = normalizePath(value);
  if (isAbsolutePath(normalized)) {
    return normalized;
  }

  return normalizePath(`${workspaceRoot}/${normalized}`);
}

function parentDirectory(value) {
  const separator = value.lastIndexOf("/");
  return separator <= 0 ? value : value.slice(0, separator);
}

function normalizeKind(kind) {
  return kind ?? NORMAL_DEPENDENCY_KIND;
}

/**
 * Finds dependency cycles that would block `cargo mono publish`.
 *
 * cargo-mono orders publishable workspace packages with every path dependency
 * edge, regardless of dependency kind. This includes normal, build, and dev
 * dependencies. The graph below mirrors that behavior.
 */
export function analyzePublishOrder(metadata) {
  const workspaceMemberIds = new Set(metadata.workspace_members);
  const workspacePackages = metadata.packages.filter((pkg) =>
    workspaceMemberIds.has(pkg.id)
  );
  const publishable = workspacePackages.filter(isPublishable);
  const publishableNames = new Set(publishable.map((pkg) => pkg.name));
  const workspaceRoot = normalizePath(metadata.workspace_root ?? "");

  const nameByDirectory = new Map();
  for (const pkg of workspacePackages) {
    const manifestPath = resolveWorkspacePath(
      workspaceRoot,
      pkg.manifest_path
    );
    nameByDirectory.set(parentDirectory(manifestPath), pkg.name);
  }

  const dependencies = new Map(
    publishable.map((pkg) => [pkg.name, new Map()])
  );
  const dependents = new Map(
    publishable.map((pkg) => [pkg.name, new Set()])
  );

  for (const pkg of publishable) {
    for (const dependency of pkg.dependencies ?? []) {
      if (!dependency.path) {
        continue;
      }

      const dependencyName = nameByDirectory.get(
        resolveWorkspacePath(workspaceRoot, dependency.path)
      );
      if (!dependencyName || !publishableNames.has(dependencyName)) {
        continue;
      }

      const kinds = dependencies.get(pkg.name).get(dependencyName) ?? new Set();
      kinds.add(normalizeKind(dependency.kind));
      dependencies.get(pkg.name).set(dependencyName, kinds);
      dependents.get(dependencyName).add(pkg.name);
    }
  }

  const indegree = new Map(
    publishable.map((pkg) => [pkg.name, dependencies.get(pkg.name).size])
  );
  const ready = [...indegree]
    .filter(([, degree]) => degree === 0)
    .map(([name]) => name);
  const order = [];

  while (ready.length > 0) {
    ready.sort();
    const name = ready.shift();
    order.push(name);

    for (const dependent of dependents.get(name)) {
      const degree = indegree.get(dependent) - 1;
      indegree.set(dependent, degree);
      if (degree === 0) {
        ready.push(dependent);
      }
    }
  }

  if (order.length === publishable.length) {
    return { packageCount: publishable.length, order, cycles: [] };
  }

  const unresolved = [...indegree]
    .filter(([, degree]) => degree > 0)
    .map(([name]) => name);
  const cycles = findCycles(unresolved, dependencies).map((packages) => ({
    packages,
    edges: describeCycleEdges(packages, dependencies),
  }));

  return { packageCount: publishable.length, order, cycles };
}

function findCycles(nodes, dependencies) {
  const nodeSet = new Set(nodes);
  const indices = new Map();
  const lowlinks = new Map();
  const stack = [];
  const onStack = new Set();
  const components = [];
  let nextIndex = 0;

  const visit = (node) => {
    indices.set(node, nextIndex);
    lowlinks.set(node, nextIndex);
    nextIndex += 1;
    stack.push(node);
    onStack.add(node);

    for (const dependency of dependencies.get(node).keys()) {
      if (!nodeSet.has(dependency)) {
        continue;
      }

      if (!indices.has(dependency)) {
        visit(dependency);
        lowlinks.set(node, Math.min(lowlinks.get(node), lowlinks.get(dependency)));
      } else if (onStack.has(dependency)) {
        lowlinks.set(node, Math.min(lowlinks.get(node), indices.get(dependency)));
      }
    }

    if (lowlinks.get(node) !== indices.get(node)) {
      return;
    }

    const component = [];
    let current;
    do {
      current = stack.pop();
      onStack.delete(current);
      component.push(current);
    } while (current !== node);

    const hasSelfDependency =
      component.length === 1 && dependencies.get(component[0]).has(component[0]);
    if (component.length > 1 || hasSelfDependency) {
      components.push(component.sort());
    }
  };

  for (const node of [...nodes].sort()) {
    if (!indices.has(node)) {
      visit(node);
    }
  }

  return components.sort((left, right) =>
    left[0].localeCompare(right[0])
  );
}

function describeCycleEdges(packages, dependencies) {
  const packageSet = new Set(packages);
  const edges = [];

  for (const from of packages) {
    for (const [to, kinds] of dependencies.get(from)) {
      if (packageSet.has(to)) {
        edges.push({ from, to, kinds: [...kinds].sort() });
      }
    }
  }

  return edges;
}
