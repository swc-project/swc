//! Fork from [`petgraph::graphmap`] v0.7.1. This fork uses faster hash
//! function.
//!
//! `GraphMap<N, E, Ty>` is a graph datastructure where node values are mapping
//! keys.

use std::{
    cmp::Ordering,
    collections::{hash_map::RandomState, HashSet},
    fmt,
    hash::{self, BuildHasher, Hash},
    iter::{Copied, FromIterator},
    marker::PhantomData,
    mem,
    ops::{Deref, Index, IndexMut},
    slice::Iter,
};

#[cfg(feature = "rayon")]
use indexmap::map::rayon::{ParIter, ParIterMut, ParKeys};
use indexmap::{
    map::{Iter as IndexMapIter, IterMut as IndexMapIterMut, Keys},
    IndexMap,
};
use petgraph::{
    graph::{node_index, Graph},
    graphmap::Nodes,
    visit, Directed, Direction, EdgeType, Incoming, IntoWeightedEdge, Outgoing, Undirected,
};
#[cfg(feature = "rayon")]
use rayon::prelude::*;

/// A `GraphMap` with undirected edges.
///
/// For example, an edge between *1* and *2* is equivalent to an edge between
/// *2* and *1*.
pub type UnGraphMap<N, E> = GraphMap<N, E, Undirected>;
/// A `GraphMap` with directed edges.
///
/// For example, an edge from *1* to *2* is distinct from an edge from *2* to
/// *1*.
pub type DiGraphMap<N, E> = GraphMap<N, E, Directed>;

/// `GraphMap<N, E, Ty>` is a graph datastructure using an associative array
/// of its node weights `N`.
///
/// It uses an combined adjacency list and sparse adjacency matrix
/// representation, using **O(|V| + |E|)** space, and allows testing for edge
/// existence in constant time.
///
/// `GraphMap` is parameterized over:
///
/// - Associated data `N` for nodes and `E` for edges, called *weights*.
/// - The node weight `N` must implement `Copy` and will be used as node
///   identifier, duplicated into several places in the data structure. It must
///   be suitable as a hash table key (implementing `Eq + Hash`). The node type
///   must also implement `Ord` so that the implementation can order the pair
///   (`a`, `b`) for an edge connecting any two nodes `a` and `b`.
/// - `E` can be of arbitrary type.
/// - Edge type `Ty` that determines whether the graph edges are directed or
///   undirected.
///
/// You can use the type aliases `UnGraphMap` and `DiGraphMap` for convenience.
///
/// `GraphMap` does not allow parallel edges, but self loops are allowed.
///
/// Depends on crate feature `graphmap` (default).
#[derive(Clone)]
pub struct GraphMap<N, E, Ty, S = RandomState>
where
    S: BuildHasher,
{
    nodes: IndexMap<N, Vec<(N, CompactDirection)>, S>,
    edges: IndexMap<(N, N), E, S>,
    ty: PhantomData<Ty>,
}

impl<N: Eq + Hash + fmt::Debug, E: fmt::Debug, Ty: EdgeType, S: BuildHasher> fmt::Debug
    for GraphMap<N, E, Ty, S>
{
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        self.nodes.fmt(f)
    }
}

/// A trait group for `GraphMap`'s node identifier.
pub trait NodeTrait: Copy + Ord + Hash {}
impl<N> NodeTrait for N where N: Copy + Ord + Hash {}

// non-repr(usize) version of Direction
#[derive(Copy, Clone, Debug, PartialEq)]
enum CompactDirection {
    Outgoing,
    Incoming,
}

impl CompactDirection {
    /// Return the opposite `CompactDirection`.
    #[inline]
    pub fn opposite(self) -> CompactDirection {
        match self {
            CompactDirection::Outgoing => CompactDirection::Incoming,
            CompactDirection::Incoming => CompactDirection::Outgoing,
        }
    }
}

impl From<Direction> for CompactDirection {
    fn from(d: Direction) -> Self {
        match d {
            Outgoing => CompactDirection::Outgoing,
            Incoming => CompactDirection::Incoming,
        }
    }
}

impl From<CompactDirection> for Direction {
    fn from(d: CompactDirection) -> Self {
        match d {
            CompactDirection::Outgoing => Outgoing,
            CompactDirection::Incoming => Incoming,
        }
    }
}

impl PartialEq<Direction> for CompactDirection {
    fn eq(&self, rhs: &Direction) -> bool {
        (*self as usize) == (*rhs as usize)
    }
}

#[cfg(feature = "serde-1")]
impl<N, E, Ty, S> serde::Serialize for GraphMap<N, E, Ty, S>
where
    Ty: EdgeType,
    N: NodeTrait + serde::Serialize,
    E: serde::Serialize,
    S: BuildHasher,
    Self: Clone,
{
    /// Serializes the given `GraphMap` into the same format as the standard
    /// `Graph`. Needs feature `serde-1`.
    ///
    /// Note: the graph has to be `Clone` for this to work.
    fn serialize<Ser>(&self, serializer: Ser) -> Result<Ser::Ok, Ser::Error>
    where
        Ser: serde::Serializer,
    {
        let cloned_graph: GraphMap<N, E, Ty, S> = GraphMap::clone(self);
        let equivalent_graph: Graph<N, E, Ty, u32> = cloned_graph.into_graph();
        equivalent_graph.serialize(serializer)
    }
}

#[cfg(feature = "serde-1")]
impl<'de, N, E, Ty, S> serde::Deserialize<'de> for GraphMap<N, E, Ty, S>
where
    Ty: EdgeType,
    N: NodeTrait + serde::Deserialize<'de>,
    E: Clone + serde::Deserialize<'de>,
    S: BuildHasher + Default,
{
    /// Deserializes into a new `GraphMap` from the same format as the standard
    /// `Graph`. Needs feature `serde-1`.
    ///
    /// **Warning**: When deseralizing a graph that was not originally a
    /// `GraphMap`, the restrictions from [`from_graph`](#method.from_graph)
    /// apply.
    ///
    /// Note: The edge weights have to be `Clone` for this to work.
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let equivalent_graph: Graph<N, E, Ty, u32> = Graph::deserialize(deserializer)?;
        Ok(GraphMap::from_graph(equivalent_graph))
    }
}

impl<N, E, Ty, S> GraphMap<N, E, Ty, S>
where
    N: NodeTrait,
    Ty: EdgeType,
    S: BuildHasher,
{
    /// Create a new `GraphMap`
    pub fn new() -> Self
    where
        S: Default,
    {
        Self::default()
    }

    /// Create a new `GraphMap` with estimated capacity.
    pub fn with_capacity(nodes: usize, edges: usize) -> Self
    where
        S: Default,
    {
        Self {
            nodes: IndexMap::with_capacity_and_hasher(nodes, S::default()),
            edges: IndexMap::with_capacity_and_hasher(edges, S::default()),
            ty: PhantomData,
        }
    }

    /// Create a new `GraphMap` with estimated capacity, and specified hasher.
    pub fn with_capacity_and_hasher(nodes: usize, edges: usize, hasher: S) -> Self
    where
        S: Clone,
    {
        Self {
            nodes: IndexMap::with_capacity_and_hasher(nodes, hasher.clone()),
            edges: IndexMap::with_capacity_and_hasher(edges, hasher),
            ty: PhantomData,
        }
    }

    /// Return the current node and edge capacity of the graph.
    pub fn capacity(&self) -> (usize, usize) {
        (self.nodes.capacity(), self.edges.capacity())
    }

    /// Use their natural order to map the node pair (a, b) to a canonical edge
    /// id.
    #[inline]
    fn edge_key(a: N, b: N) -> (N, N) {
        if Ty::is_directed() || a <= b {
            (a, b)
        } else {
            (b, a)
        }
    }

    /// Whether the graph has directed edges.
    pub fn is_directed(&self) -> bool {
        Ty::is_directed()
    }

    /// Create a new `GraphMap` from an iterable of edges.
    ///
    /// Node values are taken directly from the list.
    /// Edge weights `E` may either be specified in the list,
    /// or they are filled with default values.
    ///
    /// Nodes are inserted automatically to match the edges.
    ///
    /// ```
    /// use petgraph::graphmap::UnGraphMap;
    ///
    /// // Create a new undirected GraphMap.
    /// // Use a type hint to have `()` be the edge weight type.
    /// let gr = UnGraphMap::<_, ()>::from_edges(&[
    ///     (0, 1), (0, 2), (0, 3),
    ///     (1, 2), (1, 3),
    ///     (2, 3),
    /// ]);
    /// ```
    pub fn from_edges<I>(iterable: I) -> Self
    where
        I: IntoIterator,
        I::Item: IntoWeightedEdge<E, NodeId = N>,
        S: Default,
    {
        Self::from_iter(iterable)
    }

    /// Return the number of nodes in the graph.
    pub fn node_count(&self) -> usize {
        self.nodes.len()
    }

    /// Return the number of edges in the graph.
    pub fn edge_count(&self) -> usize {
        self.edges.len()
    }

    /// Remove all nodes and edges
    pub fn clear(&mut self) {
        self.nodes.clear();
        self.edges.clear();
    }

    /// Add node `n` to the graph.
    pub fn add_node(&mut self, n: N) -> N {
        self.nodes.entry(n).or_default();
        n
    }

    /// Return `true` if node `n` was removed.
    ///
    /// Computes in **O(V)** time, due to the removal of edges with other nodes.
    pub fn remove_node(&mut self, n: N) -> bool {
        let links = match self.nodes.swap_remove(&n) {
            None => return false,
            Some(sus) => sus,
        };
        for (succ, dir) in links {
            let edge = if dir == CompactDirection::Outgoing {
                Self::edge_key(n, succ)
            } else {
                Self::edge_key(succ, n)
            };
            // remove all successor links
            self.remove_single_edge(&succ, &n, dir.opposite());
            // Remove all edge values
            self.edges.swap_remove(&edge);
        }
        true
    }

    /// Return `true` if the node is contained in the graph.
    pub fn contains_node(&self, n: N) -> bool {
        self.nodes.contains_key(&n)
    }

    /// Add an edge connecting `a` and `b` to the graph, with associated
    /// data `weight`. For a directed graph, the edge is directed from `a`
    /// to `b`.
    ///
    /// Inserts nodes `a` and/or `b` if they aren't already part of the graph.
    ///
    /// Return `None` if the edge did not previously exist, otherwise,
    /// the associated data is updated and the old value is returned
    /// as `Some(old_weight)`.
    ///
    /// ```
    /// // Create a GraphMap with directed edges, and add one edge to it
    /// use petgraph::graphmap::DiGraphMap;
    ///
    /// let mut g = DiGraphMap::new();
    /// g.add_edge("x", "y", -1);
    /// assert_eq!(g.node_count(), 2);
    /// assert_eq!(g.edge_count(), 1);
    /// assert!(g.contains_edge("x", "y"));
    /// assert!(!g.contains_edge("y", "x"));
    /// ```
    pub fn add_edge(&mut self, a: N, b: N, weight: E) -> Option<E> {
        if let old @ Some(_) = self.edges.insert(Self::edge_key(a, b), weight) {
            old
        } else {
            // insert in the adjacency list if it's a new edge
            self.nodes
                .entry(a)
                .or_insert_with(|| Vec::with_capacity(1))
                .push((b, CompactDirection::Outgoing));
            if a != b {
                // self loops don't have the Incoming entry
                self.nodes
                    .entry(b)
                    .or_insert_with(|| Vec::with_capacity(1))
                    .push((a, CompactDirection::Incoming));
            }
            None
        }
    }

    /// Remove edge relation from a to b
    ///
    /// Return `true` if it did exist.
    fn remove_single_edge(&mut self, a: &N, b: &N, dir: CompactDirection) -> bool {
        match self.nodes.get_mut(a) {
            None => false,
            Some(sus) => {
                if Ty::is_directed() {
                    match sus.iter().position(|elt| elt == &(*b, dir)) {
                        Some(index) => {
                            sus.swap_remove(index);
                            true
                        }
                        None => false,
                    }
                } else {
                    match sus.iter().position(|elt| &elt.0 == b) {
                        Some(index) => {
                            sus.swap_remove(index);
                            true
                        }
                        None => false,
                    }
                }
            }
        }
    }

    /// Remove edge from `a` to `b` from the graph and return the edge weight.
    ///
    /// Return `None` if the edge didn't exist.
    ///
    /// ```
    /// // Create a GraphMap with undirected edges, and add and remove an edge.
    /// use petgraph::graphmap::UnGraphMap;
    ///
    /// let mut g = UnGraphMap::new();
    /// g.add_edge("x", "y", -1);
    ///
    /// let edge_data = g.remove_edge("y", "x");
    /// assert_eq!(edge_data, Some(-1));
    /// assert_eq!(g.edge_count(), 0);
    /// ```
    pub fn remove_edge(&mut self, a: N, b: N) -> Option<E> {
        let exist1 = self.remove_single_edge(&a, &b, CompactDirection::Outgoing);
        let exist2 = if a != b {
            self.remove_single_edge(&b, &a, CompactDirection::Incoming)
        } else {
            exist1
        };
        let weight = self.edges.swap_remove(&Self::edge_key(a, b));
        debug_assert!(exist1 == exist2 && exist1 == weight.is_some());
        weight
    }

    /// Return `true` if the edge connecting `a` with `b` is contained in the
    /// graph.
    pub fn contains_edge(&self, a: N, b: N) -> bool {
        self.edges.contains_key(&Self::edge_key(a, b))
    }

    /// Return an iterator over the nodes of the graph.
    ///
    /// Iterator element type is `N`.
    pub fn nodes(&self) -> Nodes<'_, N> {
        Nodes {
            iter: self.nodes.keys().copied(),
        }
    }

    /// Return a parallel iterator over the nodes of the graph.
    ///
    /// Iterator element type is `N`.
    #[cfg(feature = "rayon")]
    pub fn par_nodes(&self) -> ParNodes<'_, N>
    where
        N: Send + Sync,
    {
        ParNodes {
            iter: self.nodes.par_keys(),
        }
    }

    /// Return an iterator of all nodes with an edge starting from `a`.
    ///
    /// - `Directed`: Outgoing edges from `a`.
    /// - `Undirected`: All edges from or to `a`.
    ///
    /// Produces an empty iterator if the node doesn't exist.<br>
    /// Iterator element type is `N`.
    pub fn neighbors(&self, a: N) -> Neighbors<N, Ty> {
        Neighbors {
            iter: match self.nodes.get(&a) {
                Some(neigh) => neigh.iter(),
                None => [].iter(),
            },
            ty: self.ty,
        }
    }

    /// Return an iterator of all neighbors that have an edge between them and
    /// `a`, in the specified direction.
    /// If the graph's edges are undirected, this is equivalent to
    /// *.neighbors(a)*.
    ///
    /// - `Directed`, `Outgoing`: All edges from `a`.
    /// - `Directed`, `Incoming`: All edges to `a`.
    /// - `Undirected`: All edges from or to `a`.
    ///
    /// Produces an empty iterator if the node doesn't exist.<br>
    /// Iterator element type is `N`.
    pub fn neighbors_directed(&self, a: N, dir: Direction) -> NeighborsDirected<N, Ty> {
        NeighborsDirected {
            iter: match self.nodes.get(&a) {
                Some(neigh) => neigh.iter(),
                None => [].iter(),
            },
            start_node: a,
            dir,
            ty: self.ty,
        }
    }

    /// Return an iterator of target nodes with an edge starting from `a`,
    /// paired with their respective edge weights.
    ///
    /// - `Directed`: Outgoing edges from `a`.
    /// - `Undirected`: All edges from or to `a`.
    ///
    /// Produces an empty iterator if the node doesn't exist.<br>
    /// Iterator element type is `(N, N, &E)`.
    pub fn edges(&self, a: N) -> Edges<N, E, Ty, S> {
        Edges {
            from: a,
            iter: self.neighbors(a),
            edges: &self.edges,
        }
    }

    /// Return an iterator of target nodes with an edge starting from `a`,
    /// paired with their respective edge weights.
    ///
    /// - `Directed`, `Outgoing`: All edges from `a`.
    /// - `Directed`, `Incoming`: All edges to `a`.
    /// - `Undirected`, `Outgoing`: All edges connected to `a`, with `a` being
    ///   the source of each edge.
    /// - `Undirected`, `Incoming`: All edges connected to `a`, with `a` being
    ///   the target of each edge.
    ///
    /// Produces an empty iterator if the node doesn't exist.<br>
    /// Iterator element type is `(N, N, &E)`.
    pub fn edges_directed(&self, a: N, dir: Direction) -> EdgesDirected<N, E, Ty, S> {
        EdgesDirected {
            from: a,
            iter: self.neighbors_directed(a, dir),
            dir,
            edges: &self.edges,
        }
    }

    /// Return a reference to the edge weight connecting `a` with `b`, or
    /// `None` if the edge does not exist in the graph.
    pub fn edge_weight(&self, a: N, b: N) -> Option<&E> {
        self.edges.get(&Self::edge_key(a, b))
    }

    /// Return a mutable reference to the edge weight connecting `a` with `b`,
    /// or `None` if the edge does not exist in the graph.
    pub fn edge_weight_mut(&mut self, a: N, b: N) -> Option<&mut E> {
        self.edges.get_mut(&Self::edge_key(a, b))
    }

    /// Return an iterator over all edges of the graph with their weight in
    /// arbitrary order.
    ///
    /// Iterator element type is `(N, N, &E)`
    pub fn all_edges(&self) -> AllEdges<N, E, Ty> {
        AllEdges {
            inner: self.edges.iter(),
            ty: self.ty,
        }
    }

    /// Return an iterator over all edges of the graph in arbitrary order, with
    /// a mutable reference to their weight.
    ///
    /// Iterator element type is `(N, N, &mut E)`
    pub fn all_edges_mut(&mut self) -> AllEdgesMut<N, E, Ty> {
        AllEdgesMut {
            inner: self.edges.iter_mut(),
            ty: self.ty,
        }
    }

    /// Return a parallel iterator over all edges of the graph with their weight
    /// in arbitrary order.
    ///
    /// Iterator element type is `(N, N, &E)`
    #[cfg(feature = "rayon")]
    pub fn par_all_edges(&self) -> ParAllEdges<N, E, Ty>
    where
        N: Send + Sync,
        E: Sync,
    {
        ParAllEdges {
            inner: self.edges.par_iter(),
            ty: PhantomData,
        }
    }

    /// Return a parallel iterator over all edges of the graph in arbitrary
    /// order, with a mutable reference to their weight.
    ///
    /// Iterator element type is `(N, N, &mut E)`
    #[cfg(feature = "rayon")]
    pub fn par_all_edges_mut(&mut self) -> ParAllEdgesMut<N, E, Ty>
    where
        N: Send + Sync,
        E: Send,
    {
        ParAllEdgesMut {
            inner: self.edges.par_iter_mut(),
            ty: PhantomData,
        }
    }

    /// Return a `Graph` that corresponds to this `GraphMap`.
    ///
    /// 1. Note that node and edge indices in the `Graph` have nothing in common
    ///    with the `GraphMap`s node weights `N`. The node weights `N` are used
    ///    as node weights in the resulting `Graph`, too.
    /// 2. Note that the index type is user-chosen.
    ///
    /// Computes in **O(|V| + |E|)** time (average).
    ///
    /// **Panics** if the number of nodes or edges does not fit with
    /// the resulting graph's index type.
    pub fn into_graph<Ix>(self) -> Graph<N, E, Ty, Ix>
    where
        Ix: petgraph::graph::IndexType,
    {
        // assuming two successive iterations of the same hashmap produce the same order
        let mut gr = Graph::with_capacity(self.node_count(), self.edge_count());
        for (&node, _) in &self.nodes {
            gr.add_node(node);
        }
        for ((a, b), edge_weight) in self.edges {
            let ai = self.nodes.get_index_of(&a).unwrap();
            let bi = self.nodes.get_index_of(&b).unwrap();
            gr.add_edge(node_index(ai), node_index(bi), edge_weight);
        }
        gr
    }

    /// Creates a `GraphMap` that corresponds to the given `Graph`.
    ///
    /// **Warning**: Nodes with the same weight are merged and only the last
    /// parallel edge is kept. Node and edge indices of the `Graph` are
    /// lost. Only use this function if the node weights are distinct and
    /// there are no parallel edges.
    ///
    /// Computes in **O(|V| + |E|)** time (average).
    pub fn from_graph<Ix>(graph: Graph<N, E, Ty, Ix>) -> Self
    where
        Ix: petgraph::graph::IndexType,
        E: Clone,
        S: Default,
    {
        let mut new_graph: GraphMap<N, E, Ty, S> =
            GraphMap::with_capacity(graph.node_count(), graph.edge_count());

        for node in graph.raw_nodes() {
            new_graph.add_node(node.weight);
        }

        for edge in graph.edge_indices() {
            let (a, b) = graph.edge_endpoints(edge).unwrap();
            new_graph.add_edge(
                *graph.node_weight(a).unwrap(),
                *graph.node_weight(b).unwrap(),
                graph.edge_weight(edge).unwrap().clone(),
            );
        }

        new_graph
    }
}

/// Create a new `GraphMap` from an iterable of edges.
impl<N, E, Ty, Item, S> FromIterator<Item> for GraphMap<N, E, Ty, S>
where
    Item: IntoWeightedEdge<E, NodeId = N>,
    N: NodeTrait,
    Ty: EdgeType,
    S: BuildHasher + Default,
{
    fn from_iter<I>(iterable: I) -> Self
    where
        I: IntoIterator<Item = Item>,
    {
        let iter = iterable.into_iter();
        let (low, _) = iter.size_hint();
        let mut g = Self::with_capacity(0, low);
        g.extend(iter);
        g
    }
}

/// Extend the graph from an iterable of edges.
///
/// Nodes are inserted automatically to match the edges.
impl<N, E, Ty, Item, S> Extend<Item> for GraphMap<N, E, Ty, S>
where
    Item: IntoWeightedEdge<E, NodeId = N>,
    N: NodeTrait,
    Ty: EdgeType,
    S: BuildHasher,
{
    fn extend<I>(&mut self, iterable: I)
    where
        I: IntoIterator<Item = Item>,
    {
        let iter = iterable.into_iter();
        let (low, _) = iter.size_hint();
        self.edges.reserve(low);

        for elt in iter {
            let (source, target, weight) = elt.into_weighted_edge();
            self.add_edge(source, target, weight);
        }
    }
}

iterator_wrap! {
    impl (Iterator DoubleEndedIterator ExactSizeIterator) for
    #[derive(Debug, Clone)]
    struct Nodes <'a, N> where { N: 'a + NodeTrait }
    item: N,
    iter: Copied<Keys<'a, N, Vec<(N, CompactDirection)>>>,
}

#[derive(Debug, Clone)]
pub struct Neighbors<'a, N, Ty = Undirected>
where
    N: 'a,
    Ty: EdgeType,
{
    iter: Iter<'a, (N, CompactDirection)>,
    ty: PhantomData<Ty>,
}

impl<N, Ty> Iterator for Neighbors<'_, N, Ty>
where
    N: NodeTrait,
    Ty: EdgeType,
{
    type Item = N;

    fn next(&mut self) -> Option<N> {
        if Ty::is_directed() {
            (&mut self.iter)
                .filter_map(|&(n, dir)| if dir == Outgoing { Some(n) } else { None })
                .next()
        } else {
            self.iter.next().map(|&(n, _)| n)
        }
    }

    fn size_hint(&self) -> (usize, Option<usize>) {
        let (lower, upper) = self.iter.size_hint();
        if Ty::is_directed() {
            (0, upper)
        } else {
            (lower, upper)
        }
    }
}

#[derive(Debug, Clone)]
pub struct NeighborsDirected<'a, N, Ty>
where
    N: 'a,
    Ty: EdgeType,
{
    iter: Iter<'a, (N, CompactDirection)>,
    start_node: N,
    dir: Direction,
    ty: PhantomData<Ty>,
}

impl<N, Ty> Iterator for NeighborsDirected<'_, N, Ty>
where
    N: NodeTrait,
    Ty: EdgeType,
{
    type Item = N;

    fn next(&mut self) -> Option<N> {
        if Ty::is_directed() {
            let self_dir = self.dir;
            let start_node = self.start_node;
            (&mut self.iter)
                .filter_map(move |&(n, dir)| {
                    if dir == self_dir || n == start_node {
                        Some(n)
                    } else {
                        None
                    }
                })
                .next()
        } else {
            self.iter.next().map(|&(n, _)| n)
        }
    }

    fn size_hint(&self) -> (usize, Option<usize>) {
        let (lower, upper) = self.iter.size_hint();
        if Ty::is_directed() {
            (0, upper)
        } else {
            (lower, upper)
        }
    }
}

#[derive(Debug, Clone)]
pub struct Edges<'a, N, E: 'a, Ty, S = RandomState>
where
    N: 'a + NodeTrait,
    Ty: EdgeType,
    S: BuildHasher,
{
    from: N,
    edges: &'a IndexMap<(N, N), E, S>,
    iter: Neighbors<'a, N, Ty>,
}

impl<'a, N, E, Ty, S> Iterator for Edges<'a, N, E, Ty, S>
where
    N: 'a + NodeTrait,
    E: 'a,
    Ty: EdgeType,
    S: BuildHasher,
{
    type Item = (N, N, &'a E);

    fn next(&mut self) -> Option<Self::Item> {
        self.iter.next().map(|b| {
            let a = self.from;
            match self.edges.get(&GraphMap::<N, E, Ty>::edge_key(a, b)) {
                None => unreachable!(),
                Some(edge) => (a, b, edge),
            }
        })
    }

    fn size_hint(&self) -> (usize, Option<usize>) {
        self.iter.size_hint()
    }
}

#[derive(Debug, Clone)]
pub struct EdgesDirected<'a, N, E: 'a, Ty, S = RandomState>
where
    N: 'a + NodeTrait,
    Ty: EdgeType,
    S: BuildHasher,
{
    from: N,
    dir: Direction,
    edges: &'a IndexMap<(N, N), E, S>,
    iter: NeighborsDirected<'a, N, Ty>,
}

impl<'a, N, E, Ty, S> Iterator for EdgesDirected<'a, N, E, Ty, S>
where
    N: 'a + NodeTrait,
    E: 'a,
    Ty: EdgeType,
    S: BuildHasher,
{
    type Item = (N, N, &'a E);

    fn next(&mut self) -> Option<Self::Item> {
        self.iter.next().map(|mut b| {
            let mut a = self.from;
            if self.dir == Direction::Incoming {
                mem::swap(&mut a, &mut b);
            }
            match self.edges.get(&GraphMap::<N, E, Ty>::edge_key(a, b)) {
                None => unreachable!(),
                Some(edge) => (a, b, edge),
            }
        })
    }

    fn size_hint(&self) -> (usize, Option<usize>) {
        self.iter.size_hint()
    }
}

#[derive(Debug, Clone)]
pub struct AllEdges<'a, N, E: 'a, Ty>
where
    N: 'a + NodeTrait,
{
    inner: IndexMapIter<'a, (N, N), E>,
    ty: PhantomData<Ty>,
}

impl<'a, N, E, Ty> Iterator for AllEdges<'a, N, E, Ty>
where
    N: 'a + NodeTrait,
    E: 'a,
    Ty: EdgeType,
{
    type Item = (N, N, &'a E);

    fn next(&mut self) -> Option<Self::Item> {
        self.inner.next().map(|(&(a, b), v)| (a, b, v))
    }

    fn size_hint(&self) -> (usize, Option<usize>) {
        self.inner.size_hint()
    }

    fn count(self) -> usize {
        self.inner.count()
    }

    fn nth(&mut self, n: usize) -> Option<Self::Item> {
        self.inner
            .nth(n)
            .map(|(&(n1, n2), weight)| (n1, n2, weight))
    }

    fn last(self) -> Option<Self::Item> {
        self.inner
            .last()
            .map(|(&(n1, n2), weight)| (n1, n2, weight))
    }
}

impl<'a, N, E, Ty> DoubleEndedIterator for AllEdges<'a, N, E, Ty>
where
    N: 'a + NodeTrait,
    E: 'a,
    Ty: EdgeType,
{
    fn next_back(&mut self) -> Option<Self::Item> {
        self.inner
            .next_back()
            .map(|(&(n1, n2), weight)| (n1, n2, weight))
    }
}

pub struct AllEdgesMut<'a, N, E: 'a, Ty>
where
    N: 'a + NodeTrait,
{
    inner: IndexMapIterMut<'a, (N, N), E>, /* TODO: change to something that implements Debug +
                                            * Clone? */
    ty: PhantomData<Ty>,
}

impl<'a, N, E, Ty> Iterator for AllEdgesMut<'a, N, E, Ty>
where
    N: 'a + NodeTrait,
    E: 'a,
    Ty: EdgeType,
{
    type Item = (N, N, &'a mut E);

    fn next(&mut self) -> Option<Self::Item> {
        self.inner
            .next()
            .map(|(&(n1, n2), weight)| (n1, n2, weight))
    }

    fn size_hint(&self) -> (usize, Option<usize>) {
        self.inner.size_hint()
    }

    fn count(self) -> usize {
        self.inner.count()
    }

    fn nth(&mut self, n: usize) -> Option<Self::Item> {
        self.inner
            .nth(n)
            .map(|(&(n1, n2), weight)| (n1, n2, weight))
    }

    fn last(self) -> Option<Self::Item> {
        self.inner
            .last()
            .map(|(&(n1, n2), weight)| (n1, n2, weight))
    }
}

impl<'a, N, E, Ty> DoubleEndedIterator for AllEdgesMut<'a, N, E, Ty>
where
    N: 'a + NodeTrait,
    E: 'a,
    Ty: EdgeType,
{
    fn next_back(&mut self) -> Option<Self::Item> {
        self.inner
            .next_back()
            .map(|(&(n1, n2), weight)| (n1, n2, weight))
    }
}

/// Index `GraphMap` by node pairs to access edge weights.
impl<N, E, Ty, S> Index<(N, N)> for GraphMap<N, E, Ty, S>
where
    N: NodeTrait,
    Ty: EdgeType,
    S: BuildHasher,
{
    type Output = E;

    fn index(&self, index: (N, N)) -> &E {
        let index = Self::edge_key(index.0, index.1);
        self.edge_weight(index.0, index.1)
            .expect("GraphMap::index: no such edge")
    }
}

/// Index `GraphMap` by node pairs to access edge weights.
impl<N, E, Ty, S> IndexMut<(N, N)> for GraphMap<N, E, Ty, S>
where
    N: NodeTrait,
    Ty: EdgeType,
    S: BuildHasher,
{
    fn index_mut(&mut self, index: (N, N)) -> &mut E {
        let index = Self::edge_key(index.0, index.1);
        self.edge_weight_mut(index.0, index.1)
            .expect("GraphMap::index: no such edge")
    }
}

/// Create a new empty `GraphMap`.
impl<N, E, Ty, S> Default for GraphMap<N, E, Ty, S>
where
    N: NodeTrait,
    Ty: EdgeType,
    S: BuildHasher + Default,
{
    fn default() -> Self {
        GraphMap::with_capacity(0, 0)
    }
}

/// A reference that is hashed and compared by its pointer value.
///
/// `Ptr` is used for certain configurations of `GraphMap`,
/// in particular in the combination where the node type for
/// `GraphMap` is something of type for example `Ptr(&Cell<T>)`,
/// with the `Cell<T>` being `TypedArena` allocated.
pub struct Ptr<'b, T: 'b>(pub &'b T);

impl<T> Copy for Ptr<'_, T> {}
impl<T> Clone for Ptr<'_, T> {
    fn clone(&self) -> Self {
        *self
    }
}

fn ptr_eq<T>(a: *const T, b: *const T) -> bool {
    a == b
}

impl<'b, T> PartialEq for Ptr<'b, T> {
    /// Ptr compares by pointer equality, i.e if they point to the same value
    fn eq(&self, other: &Ptr<'b, T>) -> bool {
        ptr_eq(self.0, other.0)
    }
}

impl<'b, T> PartialOrd for Ptr<'b, T> {
    fn partial_cmp(&self, other: &Ptr<'b, T>) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

impl<'b, T> Ord for Ptr<'b, T> {
    /// Ptr is ordered by pointer value, i.e. an arbitrary but stable and total
    /// order.
    fn cmp(&self, other: &Ptr<'b, T>) -> Ordering {
        let a: *const T = self.0;
        let b: *const T = other.0;
        a.cmp(&b)
    }
}

impl<T> Deref for Ptr<'_, T> {
    type Target = T;

    fn deref(&self) -> &T {
        self.0
    }
}

impl<T> Eq for Ptr<'_, T> {}

impl<T> Hash for Ptr<'_, T> {
    fn hash<H: hash::Hasher>(&self, st: &mut H) {
        let ptr = (self.0) as *const T;
        ptr.hash(st)
    }
}

impl<T: fmt::Debug> fmt::Debug for Ptr<'_, T> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        self.0.fmt(f)
    }
}

#[derive(Debug, Clone)]
pub struct NodeIdentifiers<'a, N, E: 'a, Ty>
where
    N: 'a + NodeTrait,
{
    iter: IndexMapIter<'a, N, Vec<(N, CompactDirection)>>,
    ty: PhantomData<Ty>,
    edge_ty: PhantomData<E>,
}

impl<'a, N, E, Ty> Iterator for NodeIdentifiers<'a, N, E, Ty>
where
    N: 'a + NodeTrait,
    E: 'a,
    Ty: EdgeType,
{
    type Item = N;

    fn next(&mut self) -> Option<Self::Item> {
        self.iter.next().map(|(&n, _)| n)
    }

    fn size_hint(&self) -> (usize, Option<usize>) {
        self.iter.size_hint()
    }
}

#[derive(Debug, Clone)]
pub struct NodeReferences<'a, N, E: 'a, Ty>
where
    N: 'a + NodeTrait,
{
    iter: IndexMapIter<'a, N, Vec<(N, CompactDirection)>>,
    ty: PhantomData<Ty>,
    edge_ty: PhantomData<E>,
}

impl<'a, N, E, Ty> Iterator for NodeReferences<'a, N, E, Ty>
where
    N: 'a + NodeTrait,
    E: 'a,
    Ty: EdgeType,
{
    type Item = (N, &'a N);

    fn next(&mut self) -> Option<Self::Item> {
        self.iter.next().map(|(n, _)| (*n, n))
    }

    fn size_hint(&self) -> (usize, Option<usize>) {
        self.iter.size_hint()
    }
}

impl<N, E, Ty, S> visit::GraphBase for GraphMap<N, E, Ty, S>
where
    N: Copy + PartialEq,
    S: BuildHasher,
{
    type EdgeId = (N, N);
    type NodeId = N;
}

impl<N, E, Ty, S> visit::Data for GraphMap<N, E, Ty, S>
where
    N: Copy + PartialEq,
    Ty: EdgeType,
    S: BuildHasher,
{
    type EdgeWeight = E;
    type NodeWeight = N;
}

impl<N, E, Ty, S> visit::Visitable for GraphMap<N, E, Ty, S>
where
    N: Copy + Ord + Hash,
    Ty: EdgeType,
    S: BuildHasher,
{
    type Map = HashSet<N>;

    fn visit_map(&self) -> HashSet<N> {
        HashSet::with_capacity(self.node_count())
    }

    fn reset_map(&self, map: &mut Self::Map) {
        map.clear();
    }
}

impl<N, E, Ty, S> visit::GraphProp for GraphMap<N, E, Ty, S>
where
    N: NodeTrait,
    Ty: EdgeType,
    S: BuildHasher,
{
    type EdgeType = Ty;
}

impl<'a, N, E, Ty, S> visit::IntoNodeReferences for &'a GraphMap<N, E, Ty, S>
where
    N: NodeTrait,
    Ty: EdgeType,
    S: BuildHasher,
{
    type NodeRef = (N, &'a N);
    type NodeReferences = NodeReferences<'a, N, E, Ty>;

    fn node_references(self) -> Self::NodeReferences {
        NodeReferences {
            iter: self.nodes.iter(),
            ty: self.ty,
            edge_ty: PhantomData,
        }
    }
}

impl<'a, N, E: 'a, Ty, S> visit::IntoNodeIdentifiers for &'a GraphMap<N, E, Ty, S>
where
    N: NodeTrait,
    Ty: EdgeType,
    S: BuildHasher,
{
    type NodeIdentifiers = NodeIdentifiers<'a, N, E, Ty>;

    fn node_identifiers(self) -> Self::NodeIdentifiers {
        NodeIdentifiers {
            iter: self.nodes.iter(),
            ty: self.ty,
            edge_ty: PhantomData,
        }
    }
}

impl<N, E, Ty, S> visit::NodeCount for GraphMap<N, E, Ty, S>
where
    N: NodeTrait,
    Ty: EdgeType,
    S: BuildHasher,
{
    fn node_count(&self) -> usize {
        (*self).node_count()
    }
}

impl<N, E, Ty, S> visit::NodeIndexable for GraphMap<N, E, Ty, S>
where
    N: NodeTrait,
    Ty: EdgeType,
    S: BuildHasher,
{
    fn node_bound(&self) -> usize {
        self.node_count()
    }

    fn to_index(&self, ix: Self::NodeId) -> usize {
        self.nodes.get_index_of(&ix).unwrap()
    }

    fn from_index(&self, ix: usize) -> Self::NodeId {
        assert!(
            ix < self.nodes.len(),
            "The requested index {} is out-of-bounds.",
            ix
        );
        let (&key, _) = self.nodes.get_index(ix).unwrap();
        key
    }
}

impl<N, E, Ty, S> visit::NodeCompactIndexable for GraphMap<N, E, Ty, S>
where
    N: NodeTrait,
    Ty: EdgeType,
    S: BuildHasher,
{
}

impl<'a, N: 'a, E, Ty, S> visit::IntoNeighbors for &'a GraphMap<N, E, Ty, S>
where
    N: Copy + Ord + Hash,
    Ty: EdgeType,
    S: BuildHasher,
{
    type Neighbors = Neighbors<'a, N, Ty>;

    fn neighbors(self, n: Self::NodeId) -> Self::Neighbors {
        self.neighbors(n)
    }
}

impl<'a, N: 'a, E, Ty, S> visit::IntoNeighborsDirected for &'a GraphMap<N, E, Ty, S>
where
    N: Copy + Ord + Hash,
    Ty: EdgeType,
    S: BuildHasher,
{
    type NeighborsDirected = NeighborsDirected<'a, N, Ty>;

    fn neighbors_directed(self, n: N, dir: Direction) -> Self::NeighborsDirected {
        self.neighbors_directed(n, dir)
    }
}

impl<N, E, Ty, S> visit::EdgeIndexable for GraphMap<N, E, Ty, S>
where
    N: NodeTrait,
    Ty: EdgeType,
    S: BuildHasher,
{
    fn edge_bound(&self) -> usize {
        self.edge_count()
    }

    fn to_index(&self, ix: Self::EdgeId) -> usize {
        self.edges.get_index_of(&ix).unwrap()
    }

    fn from_index(&self, ix: usize) -> Self::EdgeId {
        assert!(
            ix < self.edges.len(),
            "The requested index {} is out-of-bounds.",
            ix
        );
        let (&key, _) = self.edges.get_index(ix).unwrap();
        key
    }
}

impl<'a, N: 'a, E: 'a, Ty, S> visit::IntoEdges for &'a GraphMap<N, E, Ty, S>
where
    N: NodeTrait,
    Ty: EdgeType,
    S: BuildHasher,
{
    type Edges = Edges<'a, N, E, Ty, S>;

    fn edges(self, a: Self::NodeId) -> Self::Edges {
        self.edges(a)
    }
}

impl<'a, N: 'a, E: 'a, Ty, S> visit::IntoEdgesDirected for &'a GraphMap<N, E, Ty, S>
where
    N: NodeTrait,
    Ty: EdgeType,
    S: BuildHasher,
{
    type EdgesDirected = EdgesDirected<'a, N, E, Ty, S>;

    fn edges_directed(self, a: Self::NodeId, dir: Direction) -> Self::EdgesDirected {
        self.edges_directed(a, dir)
    }
}

impl<'a, N: 'a, E: 'a, Ty, S> visit::IntoEdgeReferences for &'a GraphMap<N, E, Ty, S>
where
    N: NodeTrait,
    Ty: EdgeType,
    S: BuildHasher,
{
    type EdgeRef = (N, N, &'a E);
    type EdgeReferences = AllEdges<'a, N, E, Ty>;

    fn edge_references(self) -> Self::EdgeReferences {
        self.all_edges()
    }
}

impl<N, E, Ty, S> visit::EdgeCount for GraphMap<N, E, Ty, S>
where
    N: NodeTrait,
    Ty: EdgeType,
    S: BuildHasher,
{
    #[inline]
    fn edge_count(&self) -> usize {
        self.edge_count()
    }
}

/// The `GraphMap` keeps an adjacency matrix internally.
impl<N, E, Ty, S> visit::GetAdjacencyMatrix for GraphMap<N, E, Ty, S>
where
    N: Copy + Ord + Hash,
    Ty: EdgeType,
    S: BuildHasher,
{
    type AdjMatrix = ();

    #[inline]
    fn adjacency_matrix(&self) {}

    #[inline]
    fn is_adjacent(&self, _: &(), a: N, b: N) -> bool {
        self.contains_edge(a, b)
    }
}

/// A [ParallelIterator] over this graph's nodes.
#[cfg(feature = "rayon")]
pub struct ParNodes<'a, N>
where
    N: NodeTrait + Send + Sync,
{
    iter: ParKeys<'a, N, Vec<(N, CompactDirection)>>,
}

#[cfg(feature = "rayon")]
impl<'a, N> ParallelIterator for ParNodes<'a, N>
where
    N: NodeTrait + Send + Sync,
{
    type Item = N;

    fn drive_unindexed<C>(self, consumer: C) -> C::Result
    where
        C: rayon::iter::plumbing::UnindexedConsumer<Self::Item>,
    {
        self.iter.copied().drive_unindexed(consumer)
    }

    fn opt_len(&self) -> Option<usize> {
        self.iter.opt_len()
    }
}

#[cfg(feature = "rayon")]
impl<'a, N> IndexedParallelIterator for ParNodes<'a, N>
where
    N: NodeTrait + Send + Sync,
{
    fn drive<C>(self, consumer: C) -> C::Result
    where
        C: rayon::iter::plumbing::Consumer<Self::Item>,
    {
        self.iter.copied().drive(consumer)
    }

    fn len(&self) -> usize {
        self.iter.len()
    }

    fn with_producer<CB>(self, callback: CB) -> CB::Output
    where
        CB: rayon::iter::plumbing::ProducerCallback<Self::Item>,
    {
        self.iter.copied().with_producer(callback)
    }
}

/// A [ParallelIterator] over this graph's edges.
#[cfg(feature = "rayon")]
pub struct ParAllEdges<'a, N, E, Ty>
where
    N: NodeTrait + Send + Sync,
    E: Sync,
{
    inner: ParIter<'a, (N, N), E>,
    ty: PhantomData<fn(Ty)>,
}

#[cfg(feature = "rayon")]
impl<'a, N, E, Ty> ParallelIterator for ParAllEdges<'a, N, E, Ty>
where
    N: NodeTrait + Send + Sync,
    E: Sync,
{
    type Item = (N, N, &'a E);

    fn drive_unindexed<C>(self, c: C) -> C::Result
    where
        C: rayon::iter::plumbing::UnindexedConsumer<Self::Item>,
    {
        self.inner.map(|(&(a, b), v)| (a, b, v)).drive_unindexed(c)
    }

    fn opt_len(&self) -> Option<usize> {
        self.inner.opt_len()
    }
}

#[cfg(feature = "rayon")]
impl<'a, N, E, Ty> IndexedParallelIterator for ParAllEdges<'a, N, E, Ty>
where
    N: NodeTrait + Send + Sync,
    E: Sync,
{
    fn drive<C>(self, consumer: C) -> C::Result
    where
        C: rayon::iter::plumbing::Consumer<Self::Item>,
    {
        self.inner.map(|(&(a, b), v)| (a, b, v)).drive(consumer)
    }

    fn len(&self) -> usize {
        self.inner.len()
    }

    fn with_producer<CB>(self, callback: CB) -> CB::Output
    where
        CB: rayon::iter::plumbing::ProducerCallback<Self::Item>,
    {
        self.inner
            .map(|(&(a, b), v)| (a, b, v))
            .with_producer(callback)
    }
}

/// A [ParallelIterator] over this graph's edges by mutable reference.
#[cfg(feature = "rayon")]
pub struct ParAllEdgesMut<'a, N, E: 'a, Ty>
where
    N: NodeTrait + Send + Sync,
    E: Send,
{
    inner: ParIterMut<'a, (N, N), E>,
    ty: PhantomData<fn(Ty)>,
}

#[cfg(feature = "rayon")]
impl<'a, N, E, Ty> ParallelIterator for ParAllEdgesMut<'a, N, E, Ty>
where
    N: NodeTrait + Send + Sync,
    E: Send,
{
    type Item = (N, N, &'a mut E);

    fn drive_unindexed<C>(self, c: C) -> C::Result
    where
        C: rayon::iter::plumbing::UnindexedConsumer<Self::Item>,
    {
        self.inner.map(|(&(a, b), v)| (a, b, v)).drive_unindexed(c)
    }

    fn opt_len(&self) -> Option<usize> {
        self.inner.opt_len()
    }
}

#[cfg(feature = "rayon")]
impl<'a, N, E, Ty> IndexedParallelIterator for ParAllEdgesMut<'a, N, E, Ty>
where
    N: NodeTrait + Send + Sync,
    E: Send,
{
    fn drive<C>(self, consumer: C) -> C::Result
    where
        C: rayon::iter::plumbing::Consumer<Self::Item>,
    {
        self.inner.map(|(&(a, b), v)| (a, b, v)).drive(consumer)
    }

    fn len(&self) -> usize {
        self.inner.len()
    }

    fn with_producer<CB>(self, callback: CB) -> CB::Output
    where
        CB: rayon::iter::plumbing::ProducerCallback<Self::Item>,
    {
        self.inner
            .map(|(&(a, b), v)| (a, b, v))
            .with_producer(callback)
    }
}
