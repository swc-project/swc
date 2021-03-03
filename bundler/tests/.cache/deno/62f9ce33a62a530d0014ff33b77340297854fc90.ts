// Loaded from https://deno.land/x/mysql/src/constant/packet.ts


export enum PacketType {
  OK_Packet = 0x00,
  EOF_Packet = 0xfe,
  ERR_Packet = 0xff,
  Result,
}
