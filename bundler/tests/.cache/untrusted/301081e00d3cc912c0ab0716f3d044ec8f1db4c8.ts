// Loaded from https://dev.jspm.io/npm:ngraph.graph@19.1.0/index.dew.js


import { dew as _npmNgraphDew } from "/npm:ngraph.events@1?dew";
var exports = {},
    _dewExec = false;

var _global = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : global;

export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;

  /**
   * @fileOverview Contains definition of the core graph object.
   */
  // TODO: need to change storage layer:
  // 1. Be able to get all nodes O(1)
  // 2. Be able to get number of links O(1)

  /**
   * @example
   *  var graph = require('ngraph.graph')();
   *  graph.addNode(1);     // graph has one node.
   *  graph.addLink(2, 3);  // now graph contains three nodes and one link.
   *
   */
  exports = createGraph;

  var eventify = _npmNgraphDew();
  /**
   * Creates a new graph
   */


  function createGraph(options) {
    // Graph structure is maintained as dictionary of nodes
    // and array of links. Each node has 'links' property which
    // hold all links related to that node. And general links
    // array is used to speed up all links enumeration. This is inefficient
    // in terms of memory, but simplifies coding.
    options = options || {};

    if ('uniqueLinkId' in options) {
      console.warn('ngraph.graph: Starting from version 0.14 `uniqueLinkId` is deprecated.\n' + 'Use `multigraph` option instead\n', '\n', 'Note: there is also change in default behavior: From now on each graph\n' + 'is considered to be not a multigraph by default (each edge is unique).');
      options.multigraph = options.uniqueLinkId;
    } // Dear reader, the non-multigraphs do not guarantee that there is only
    // one link for a given pair of node. When this option is set to false
    // we can save some memory and CPU (18% faster for non-multigraph);


    if (options.multigraph === undefined) options.multigraph = false;

    if (typeof Map !== 'function') {
      // TODO: Should we polyfill it ourselves? We don't use much operations there..
      throw new Error('ngraph.graph requires `Map` to be defined. Please polyfill it before using ngraph');
    }

    var nodes = new Map();
    var links = [],
        // Hash of multi-edges. Used to track ids of edges between same nodes
    multiEdges = {},
        suspendEvents = 0,
        createLink = options.multigraph ? createUniqueLink : createSingleLink,
        // Our graph API provides means to listen to graph changes. Users can subscribe
    // to be notified about changes in the graph by using `on` method. However
    // in some cases they don't use it. To avoid unnecessary memory consumption
    // we will not record graph changes until we have at least one subscriber.
    // Code below supports this optimization.
    //
    // Accumulates all changes made during graph updates.
    // Each change element contains:
    //  changeType - one of the strings: 'add', 'remove' or 'update';
    //  node - if change is related to node this property is set to changed graph's node;
    //  link - if change is related to link this property is set to changed graph's link;
    changes = [],
        recordLinkChange = noop,
        recordNodeChange = noop,
        enterModification = noop,
        exitModification = noop; // this is our public API:

    var graphPart = {
      /**
       * Adds node to the graph. If node with given id already exists in the graph
       * its data is extended with whatever comes in 'data' argument.
       *
       * @param nodeId the node's identifier. A string or number is preferred.
       * @param [data] additional data for the node being added. If node already
       *   exists its data object is augmented with the new one.
       *
       * @return {node} The newly added node or node with given id if it already exists.
       */
      addNode: addNode,

      /**
       * Adds a link to the graph. The function always create a new
       * link between two nodes. If one of the nodes does not exists
       * a new node is created.
       *
       * @param fromId link start node id;
       * @param toId link end node id;
       * @param [data] additional data to be set on the new link;
       *
       * @return {link} The newly created link
       */
      addLink: addLink,

      /**
       * Removes link from the graph. If link does not exist does nothing.
       *
       * @param link - object returned by addLink() or getLinks() methods.
       *
       * @returns true if link was removed; false otherwise.
       */
      removeLink: removeLink,

      /**
       * Removes node with given id from the graph. If node does not exist in the graph
       * does nothing.
       *
       * @param nodeId node's identifier passed to addNode() function.
       *
       * @returns true if node was removed; false otherwise.
       */
      removeNode: removeNode,

      /**
       * Gets node with given identifier. If node does not exist undefined value is returned.
       *
       * @param nodeId requested node identifier;
       *
       * @return {node} in with requested identifier or undefined if no such node exists.
       */
      getNode: getNode,

      /**
       * Gets number of nodes in this graph.
       *
       * @return number of nodes in the graph.
       */
      getNodeCount: getNodeCount,

      /**
       * Gets total number of links in the graph.
       */
      getLinkCount: getLinkCount,

      /**
       * Synonym for `getLinkCount()`
       */
      getLinksCount: getLinkCount,

      /**
       * Synonym for `getNodeCount()`
       */
      getNodesCount: getNodeCount,

      /**
       * Gets all links (inbound and outbound) from the node with given id.
       * If node with given id is not found null is returned.
       *
       * @param nodeId requested node identifier.
       *
       * @return Array of links from and to requested node if such node exists;
       *   otherwise null is returned.
       */
      getLinks: getLinks,

      /**
       * Invokes callback on each node of the graph.
       *
       * @param {Function(node)} callback Function to be invoked. The function
       *   is passed one argument: visited node.
       */
      forEachNode: forEachNode,

      /**
       * Invokes callback on every linked (adjacent) node to the given one.
       *
       * @param nodeId Identifier of the requested node.
       * @param {Function(node, link)} callback Function to be called on all linked nodes.
       *   The function is passed two parameters: adjacent node and link object itself.
       * @param oriented if true graph treated as oriented.
       */
      forEachLinkedNode: forEachLinkedNode,

      /**
       * Enumerates all links in the graph
       *
       * @param {Function(link)} callback Function to be called on all links in the graph.
       *   The function is passed one parameter: graph's link object.
       *
       * Link object contains at least the following fields:
       *  fromId - node id where link starts;
       *  toId - node id where link ends,
       *  data - additional data passed to graph.addLink() method.
       */
      forEachLink: forEachLink,

      /**
       * Suspend all notifications about graph changes until
       * endUpdate is called.
       */
      beginUpdate: enterModification,

      /**
       * Resumes all notifications about graph changes and fires
       * graph 'changed' event in case there are any pending changes.
       */
      endUpdate: exitModification,

      /**
       * Removes all nodes and links from the graph.
       */
      clear: clear,

      /**
       * Detects whether there is a link between two nodes.
       * Operation complexity is O(n) where n - number of links of a node.
       * NOTE: this function is synonim for getLink()
       *
       * @returns link if there is one. null otherwise.
       */
      hasLink: getLink,

      /**
       * Detects whether there is a node with given id
       * 
       * Operation complexity is O(1)
       * NOTE: this function is synonim for getNode()
       *
       * @returns node if there is one; Falsy value otherwise.
       */
      hasNode: getNode,

      /**
       * Gets an edge between two nodes.
       * Operation complexity is O(n) where n - number of links of a node.
       *
       * @param {string} fromId link start identifier
       * @param {string} toId link end identifier
       *
       * @returns link if there is one. null otherwise.
       */
      getLink: getLink
    }; // this will add `on()` and `fire()` methods.

    eventify(graphPart);
    monitorSubscribers();
    return graphPart;

    function monitorSubscribers() {
      var realOn = graphPart.on; // replace real `on` with our temporary on, which will trigger change
      // modification monitoring:

      graphPart.on = on;

      function on() {
        // now it's time to start tracking stuff:
        graphPart.beginUpdate = enterModification = enterModificationReal;
        graphPart.endUpdate = exitModification = exitModificationReal;
        recordLinkChange = recordLinkChangeReal;
        recordNodeChange = recordNodeChangeReal; // this will replace current `on` method with real pub/sub from `eventify`.

        graphPart.on = realOn; // delegate to real `on` handler:

        return realOn.apply(graphPart, arguments);
      }
    }

    function recordLinkChangeReal(link, changeType) {
      changes.push({
        link: link,
        changeType: changeType
      });
    }

    function recordNodeChangeReal(node, changeType) {
      changes.push({
        node: node,
        changeType: changeType
      });
    }

    function addNode(nodeId, data) {
      if (nodeId === undefined) {
        throw new Error('Invalid node identifier');
      }

      enterModification();
      var node = getNode(nodeId);

      if (!node) {
        node = new Node(nodeId, data);
        recordNodeChange(node, 'add');
      } else {
        node.data = data;
        recordNodeChange(node, 'update');
      }

      nodes.set(nodeId, node);
      exitModification();
      return node;
    }

    function getNode(nodeId) {
      return nodes.get(nodeId);
    }

    function removeNode(nodeId) {
      var node = getNode(nodeId);

      if (!node) {
        return false;
      }

      enterModification();
      var prevLinks = node.links;

      if (prevLinks) {
        node.links = null;

        for (var i = 0; i < prevLinks.length; ++i) {
          removeLink(prevLinks[i]);
        }
      }

      nodes.delete(nodeId);
      recordNodeChange(node, 'remove');
      exitModification();
      return true;
    }

    function addLink(fromId, toId, data) {
      enterModification();
      var fromNode = getNode(fromId) || addNode(fromId);
      var toNode = getNode(toId) || addNode(toId);
      var link = createLink(fromId, toId, data);
      links.push(link); // TODO: this is not cool. On large graphs potentially would consume more memory.

      addLinkToNode(fromNode, link);

      if (fromId !== toId) {
        // make sure we are not duplicating links for self-loops
        addLinkToNode(toNode, link);
      }

      recordLinkChange(link, 'add');
      exitModification();
      return link;
    }

    function createSingleLink(fromId, toId, data) {
      var linkId = makeLinkId(fromId, toId);
      return new Link(fromId, toId, data, linkId);
    }

    function createUniqueLink(fromId, toId, data) {
      // TODO: Get rid of this method.
      var linkId = makeLinkId(fromId, toId);
      var isMultiEdge = multiEdges.hasOwnProperty(linkId);

      if (isMultiEdge || getLink(fromId, toId)) {
        if (!isMultiEdge) {
          multiEdges[linkId] = 0;
        }

        var suffix = '@' + ++multiEdges[linkId];
        linkId = makeLinkId(fromId + suffix, toId + suffix);
      }

      return new Link(fromId, toId, data, linkId);
    }

    function getNodeCount() {
      return nodes.size;
    }

    function getLinkCount() {
      return links.length;
    }

    function getLinks(nodeId) {
      var node = getNode(nodeId);
      return node ? node.links : null;
    }

    function removeLink(link) {
      if (!link) {
        return false;
      }

      var idx = indexOfElementInArray(link, links);

      if (idx < 0) {
        return false;
      }

      enterModification();
      links.splice(idx, 1);
      var fromNode = getNode(link.fromId);
      var toNode = getNode(link.toId);

      if (fromNode) {
        idx = indexOfElementInArray(link, fromNode.links);

        if (idx >= 0) {
          fromNode.links.splice(idx, 1);
        }
      }

      if (toNode) {
        idx = indexOfElementInArray(link, toNode.links);

        if (idx >= 0) {
          toNode.links.splice(idx, 1);
        }
      }

      recordLinkChange(link, 'remove');
      exitModification();
      return true;
    }

    function getLink(fromNodeId, toNodeId) {
      // TODO: Use sorted links to speed this up
      var node = getNode(fromNodeId),
          i;

      if (!node || !node.links) {
        return null;
      }

      for (i = 0; i < node.links.length; ++i) {
        var link = node.links[i];

        if (link.fromId === fromNodeId && link.toId === toNodeId) {
          return link;
        }
      }

      return null; // no link.
    }

    function clear() {
      enterModification();
      forEachNode(function (node) {
        removeNode(node.id);
      });
      exitModification();
    }

    function forEachLink(callback) {
      var i, length;

      if (typeof callback === 'function') {
        for (i = 0, length = links.length; i < length; ++i) {
          callback(links[i]);
        }
      }
    }

    function forEachLinkedNode(nodeId, callback, oriented) {
      var node = getNode(nodeId);

      if (node && node.links && typeof callback === 'function') {
        if (oriented) {
          return forEachOrientedLink(node.links, nodeId, callback);
        } else {
          return forEachNonOrientedLink(node.links, nodeId, callback);
        }
      }
    }

    function forEachNonOrientedLink(links, nodeId, callback) {
      var quitFast;

      for (var i = 0; i < links.length; ++i) {
        var link = links[i];
        var linkedNodeId = link.fromId === nodeId ? link.toId : link.fromId;
        quitFast = callback(nodes.get(linkedNodeId), link);

        if (quitFast) {
          return true; // Client does not need more iterations. Break now.
        }
      }
    }

    function forEachOrientedLink(links, nodeId, callback) {
      var quitFast;

      for (var i = 0; i < links.length; ++i) {
        var link = links[i];

        if (link.fromId === nodeId) {
          quitFast = callback(nodes.get(link.toId), link);

          if (quitFast) {
            return true; // Client does not need more iterations. Break now.
          }
        }
      }
    } // we will not fire anything until users of this library explicitly call `on()`
    // method.


    function noop() {} // Enter, Exit modification allows bulk graph updates without firing events.


    function enterModificationReal() {
      suspendEvents += 1;
    }

    function exitModificationReal() {
      suspendEvents -= 1;

      if (suspendEvents === 0 && changes.length > 0) {
        graphPart.fire('changed', changes);
        changes.length = 0;
      }
    }

    function forEachNode(callback) {
      if (typeof callback !== 'function') {
        throw new Error('Function is expected to iterate over graph nodes. You passed ' + callback);
      }

      var valuesIterator = nodes.values();
      var nextValue = valuesIterator.next();

      while (!nextValue.done) {
        if (callback(nextValue.value)) {
          return true; // client doesn't want to proceed. Return.
        }

        nextValue = valuesIterator.next();
      }
    }
  } // need this for old browsers. Should this be a separate module?


  function indexOfElementInArray(element, array) {
    if (!array) return -1;

    if (array.indexOf) {
      return array.indexOf(element);
    }

    var len = array.length,
        i;

    for (i = 0; i < len; i += 1) {
      if (array[i] === element) {
        return i;
      }
    }

    return -1;
  }
  /**
   * Internal structure to represent node;
   */


  function Node(id, data) {
    (this || _global).id = id;
    (this || _global).links = null;
    (this || _global).data = data;
  }

  function addLinkToNode(node, link) {
    if (node.links) {
      node.links.push(link);
    } else {
      node.links = [link];
    }
  }
  /**
   * Internal structure to represent links;
   */


  function Link(fromId, toId, data, id) {
    (this || _global).fromId = fromId;
    (this || _global).toId = toId;
    (this || _global).data = data;
    (this || _global).id = id;
  }

  function makeLinkId(fromId, toId) {
    return fromId.toString() + '👉 ' + toId.toString();
  }

  return exports;
}