type Empty = ?() => void;
type Named = ?(event: string) => number;
type Rest = ?(...Array<string>) => boolean;
type GroupedArray = ?(string)[];
