import { compileFunc } from ".";

const testContract = `
;; Simple wallet smart contract

() recv_internal(slice in_msg) impure {
  ;; do nothing for internal messages
}

() recv_external(slice in_msg) impure {
  var signature = in_msg~load_bits(512);
  var cs = in_msg;
  int msg_seqno = cs~load_uint(32);
  var cs2 = begin_parse(get_data());
  var stored_seqno = cs2~load_uint(32);
  var public_key = cs2~load_uint(256);
  cs2.end_parse();
  throw_unless(33, msg_seqno == stored_seqno);
  throw_unless(34, check_signature(slice_hash(in_msg), signature, public_key));
  accept_message();
  cs~touch();
  if (cs.slice_refs()) {
    var mode = cs~load_uint(8);
    send_raw_message(cs~load_ref(), mode);
  }
  cs.end_parse();
  set_data(begin_cell().store_uint(stored_seqno + 1, 32).store_uint(public_key, 256).end_cell());
}
`;

describe('ton-compiler', () => {
    it('should compile source', async () => {
        let compiled = await compileFunc(testContract);
        expect(compiled.fift).toMatchSnapshot();
        expect(compiled.cell.toString('hex')).toEqual('b5ee9c7201010401004f000114ff00f4a413f4bcf2c80b0102012002030004d230006ef28308d71820d31fed44d0d31fd3ffd15131baf2a103f901541042f910f2a2f8005120d74a96d307d402fb00ded1a4c8cb1fcbffc9ed54');
    });
});