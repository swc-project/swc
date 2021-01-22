/** 등록된 계좌+회원의 정보  */
@ViewEntity({
    name: "AccountMemberView",
    expression:
    `
    SELECT
        m.tmcode, m.mid, m.accea, m.qaccea, m.endday, m.quick_endday,
        (SELECT COUNT(*) FROM TBLACCOUNT a WHERE m.mid = a.mid AND a.use_quick="F") as accountCnt,
        (SELECT COUNT(*) FROM TBLACCOUNT a WHERE m.mid = a.mid AND a.use_quick="T") as accountQuickCnt
    FROM TBLMEMBER m
    `,
    //     expression: `
    //     SELECT
    //         m.tmcode, m.mid, m.accea, m.qaccea, m.endday, m.quick_endday,
    //         IFNULL(SUM(IF (use_quick= "F", 1, 0)), 0) as accountCnt,
    //         IFNULL(SUM(IF (use_quick= "T", 1, 0)), 0) as accountQuickCnt
    //     FROM TBLMEMBER m
    //     OUTER JOIN TBLACCOUNT a ON m.mid = a.mid
    // `,
})
export class AccountMemberView {
    /** 회원의 순번 */
    @ViewColumn({ name: "tmcode" })
    memberId: number;

    /** 회원의 mall 아이디 */
    @ViewColumn({ name: "mid" })
    mallId: string;

    /** 이용가능한 (일반)계좌수 */
    @ViewColumn({ name: "accea" })
    allowAccountCnt: number;

    /** 이용가능한 퀵 계좌수 */
    @ViewColumn({ name: "qaccea" })
    allowQuickAccountCnt: number;

    /** 이용가능한 (일반)계좌의 기간 */
    @ViewColumn({ name: "endday" })
    accountEnddedAt: Date;

    /** 이용가능한 퀵 계좌의 기간 */
    @ViewColumn({ name: "quick_endday" })
    accountQuickEnddedAt: Date;

    /** 현재등록한 (일반)계좌의 수 (타입: 문자열의 숫자로 출력됨) */
    @ViewColumn()
    accountCnt: number;

    /** 현재등록한 퀵 계좌의 수 (타입: 문자열의 숫자로 출력됨) */
    @ViewColumn()
    accountQuickCnt: number;
}
