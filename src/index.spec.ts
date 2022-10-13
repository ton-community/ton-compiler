import { compileContract } from ".";
import path from 'path';


describe('ton-compiler', () => {
  it('should compile source with legacy compiler', async () => {
    let compiled = await compileContract({ files: [path.resolve(__dirname, 'tests', 'test.fc')], version: 'legacy' });
    expect(compiled).toMatchInlineSnapshot(`
Object {
  "fift": "PROGRAM{
  DECLPROC recv_internal
  DECLPROC recv_external
  recv_internal PROC:<{
    //  in_msg
    DROP	// 
  }>
  recv_external PROC:<{
    //  in_msg
    9 PUSHPOW2	//  in_msg _3=512
    LDSLICEX	//  signature in_msg
    DUP	//  signature in_msg cs
    32 LDU	//  signature in_msg msg_seqno cs
    c4 PUSH	//  signature in_msg msg_seqno cs _11
    CTOS	//  signature in_msg msg_seqno cs cs2
    32 LDU	//  signature in_msg msg_seqno cs stored_seqno cs2
    256 LDU	//  signature in_msg msg_seqno cs stored_seqno public_key cs2
    ENDS
    s3 s1 XCPU	//  signature in_msg public_key cs stored_seqno msg_seqno stored_seqno
    EQUAL	//  signature in_msg public_key cs stored_seqno _23
    33 THROWIFNOT
    s0 s3 XCHG	//  signature stored_seqno public_key cs in_msg
    HASHSU	//  signature stored_seqno public_key cs _26
    s0 s4 s2 XC2PU	//  cs stored_seqno public_key _26 signature public_key
    CHKSIGNU	//  cs stored_seqno public_key _27
    34 THROWIFNOT
    ACCEPT
    s2 s0 XCPU	//  public_key stored_seqno cs cs
    SREFS	//  public_key stored_seqno cs _32
    IF:<{	//  public_key stored_seqno cs
      8 LDU	//  public_key stored_seqno mode cs
      LDREF	//  public_key stored_seqno mode _37 cs
      s0 s2 XCHG	//  public_key stored_seqno cs _37 mode
      SENDRAWMSG
    }>	//  public_key stored_seqno cs
    ENDS
    INC	//  public_key _42
    NEWC	//  public_key _42 _43
    32 STU	//  public_key _45
    256 STU	//  _47
    ENDC	//  _48
    c4 POP
  }>
}END>c
",
  "log": "",
  "ok": true,
  "output": Object {
    "data": Array [
      181,
      238,
      156,
      114,
      1,
      1,
      4,
      1,
      0,
      79,
      0,
      1,
      20,
      255,
      0,
      244,
      164,
      19,
      244,
      188,
      242,
      200,
      11,
      1,
      2,
      1,
      32,
      2,
      3,
      0,
      4,
      210,
      48,
      0,
      110,
      242,
      131,
      8,
      215,
      24,
      32,
      211,
      31,
      237,
      68,
      208,
      211,
      31,
      211,
      255,
      209,
      81,
      49,
      186,
      242,
      161,
      3,
      249,
      1,
      84,
      16,
      66,
      249,
      16,
      242,
      162,
      248,
      0,
      81,
      32,
      215,
      74,
      150,
      211,
      7,
      212,
      2,
      251,
      0,
      222,
      209,
      164,
      200,
      203,
      31,
      203,
      255,
      201,
      237,
      84,
    ],
    "type": "Buffer",
  },
}
`);
  });
  it('should compile source with v2022.10 compiler', async () => {
    let compiled = await compileContract({ files: [path.resolve(__dirname, 'tests', 'test.fc')], version: 'v2022.10' });
    expect(compiled).toMatchInlineSnapshot();
  });
});