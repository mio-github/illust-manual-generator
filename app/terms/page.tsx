'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <div>
      {/* ヘッダーセクション */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">利用規約</h1>
          <p className="text-xl text-gray-600 mb-0 max-w-3xl mx-auto">
            イラストマニュアルジェネレーターのご利用に関する規約
          </p>
        </div>
      </section>
      
      {/* 規約内容 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p>
                この利用規約（以下、「本規約」）は、イラストマニュアルジェネレーター（以下、「当サービス」）の
                利用条件を定めるものです。ユーザーの皆様（以下、「ユーザー」）には、本規約に従って当サービスを
                ご利用いただきます。
              </p>
              
              <h2>1. 規約の適用</h2>
              <p>
                本規約は、ユーザーと当サービス提供者（以下、「運営者」）との間の当サービスの利用に関わる一切の
                関係に適用されるものとします。ユーザーは、本規約に同意の上、当サービスを利用するものとします。
                当サービスを利用することにより、ユーザーは本規約に同意したものとみなされます。
              </p>
              
              <h2>2. 利用登録</h2>
              <p>
                当サービスの一部機能の利用には、登録が必要となります。ユーザーは、当サービスが定める方法によって
                利用登録を申請し、運営者がこれを承認することによって、利用登録が完了するものとします。
              </p>
              <p>
                運営者は、以下の場合には、利用登録の申請を承認しないことがあり、その理由については一切の開示義務を
                負わないものとします:
              </p>
              <ol>
                <li>利用登録の申請に際して虚偽の事項を届け出た場合</li>
                <li>本規約に違反したことがある者からの申請である場合</li>
                <li>その他、運営者が利用登録を相当でないと判断した場合</li>
              </ol>
              
              <h2>3. ユーザーIDおよびパスワードの管理</h2>
              <p>
                ユーザーは、自己の責任において、当サービスのユーザーIDおよびパスワードを適切に管理するものとします。
                ユーザーは、いかなる場合にも、ユーザーIDおよびパスワードを第三者に譲渡または貸与し、もしくは第三者と
                共用することはできません。運営者は、ユーザーIDとパスワードの組み合わせが登録情報と一致してログイン
                された場合には、そのユーザーIDを登録しているユーザー自身による利用とみなします。
              </p>
              <p>
                ユーザーID及びパスワードが第三者によって使用されたことによって生じた損害は、運営者の故意または重大な
                過失による場合を除き、運営者は一切の責任を負わないものとします。
              </p>
              
              <h2>4. 禁止事項</h2>
              <p>ユーザーは、当サービスの利用にあたり、以下の行為をしてはなりません：</p>
              <ol>
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>運営者、他のユーザー、または第三者の知的財産権、肖像権、プライバシー、名誉、その他の権利または利益を侵害する行為</li>
                <li>当サービスの運営を妨害するおそれのある行為</li>
                <li>当サービスのネットワークまたはシステム等に過度な負荷をかける行為</li>
                <li>当サービスの運営を妨害するおそれのある行為</li>
                <li>不正アクセスをし、またはこれを試みる行為</li>
                <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                <li>不正な目的を持って当サービスを利用する行為</li>
                <li>当サービスの他のユーザーまたは第三者に不利益、損害、不快感を与える行為</li>
                <li>他のユーザーに成りすます行為</li>
                <li>運営者が許諾しない当サービス上での宣伝、広告、勧誘、または営業行為</li>
                <li>面識のない異性との出会いを目的とした行為</li>
                <li>反社会的勢力に対して直接または間接に利益を供与する行為</li>
                <li>その他、運営者が不適切と判断する行為</li>
              </ol>
              
              <h2>5. 当サービスの提供の停止等</h2>
              <p>
                運営者は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく当サービスの全部
                または一部の提供を停止または中断することができるものとします:
              </p>
              <ol>
                <li>当サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                <li>地震、落雷、火災、停電または天災などの不可抗力により、当サービスの提供が困難となった場合</li>
                <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                <li>その他、運営者が当サービスの提供が困難と判断した場合</li>
              </ol>
              <p>
                運営者は、当サービスの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または
                損害についても、一切の責任を負わないものとします。
              </p>
              
              <h2>6. 著作権と知的財産権</h2>
              <p>
                ユーザーは、当サービスを通じて生成したイラストや漫画（以下、「生成コンテンツ」）について、
                以下の条件のもとで権利を有するものとします：
              </p>
              <ol>
                <li>
                  生成コンテンツの著作権は、原則としてユーザーに帰属します。ユーザーは、生成コンテンツを
                  商用・非商用問わず利用することができます。
                </li>
                <li>
                  ただし、運営者は、サービスの改善、宣伝、事例紹介等の目的で、ユーザーの生成コンテンツを
                  使用する権利を有します。この場合、運営者はユーザーのプライバシーに配慮し、個人を特定できる
                  情報は適切に処理します。
                </li>
                <li>
                  ユーザーは、生成コンテンツを第三者の権利を侵害する方法で使用してはなりません。
                </li>
                <li>
                  生成コンテンツに含まれる要素のうち、AIによって生成された部分については、
                  著作権法上の保護の対象とならない可能性があることをユーザーは了承するものとします。
                </li>
              </ol>
              <p>
                当サービス自体の著作権、商標権その他の知的財産権は、運営者または正当な権利者に帰属します。
                ユーザーは、当サービスを通じて提供されるコンテンツ（生成コンテンツを除く）について、複製、
                転用、販売、改変などの行為を行ってはなりません。
              </p>
              
              <h2>7. 利用制限および登録抹消</h2>
              <p>
                運営者は、ユーザーが以下のいずれかに該当する場合には、事前の通知なく、ユーザーに対して、
                当サービスの全部もしくは一部の利用を制限し、またはユーザーとしての登録を抹消することができるものとします:
              </p>
              <ol>
                <li>本規約のいずれかの条項に違反した場合</li>
                <li>登録事項に虚偽の事実があることが判明した場合</li>
                <li>料金等の支払債務の不履行があった場合</li>
                <li>運営者からの連絡に対し、一定期間返答がない場合</li>
                <li>当サービスについて、最終の利用から一定期間利用がない場合</li>
                <li>その他、運営者が当サービスの利用を適当でないと判断した場合</li>
              </ol>
              <p>
                運営者は、本条に基づき運営者が行った行為によりユーザーに生じた損害について、
                一切の責任を負いません。
              </p>
              
              <h2>8. 退会</h2>
              <p>
                ユーザーは、運営者の定める退会手続により、当サービスから退会できるものとします。
                退会後のユーザー情報の取扱いについては、プライバシーポリシーに定めるところによります。
              </p>
              
              <h2>9. 保証の否認および免責事項</h2>
              <p>
                運営者は、当サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、
                特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます）が
                ないことを明示的にも黙示的にも保証しておりません。
              </p>
              <p>
                運営者は、当サービスに起因してユーザーに生じたあらゆる損害について、運営者の故意または重過失による
                場合を除き、一切の責任を負いません。ただし、当サービスに関する運営者とユーザーとの間の契約（本規約を
                含みます）が消費者契約法に定める消費者契約となる場合、この免責規定は適用されません。
              </p>
              <p>
                消費者契約に該当する場合であっても、運営者は、運営者の過失（重過失を除きます）による債務不履行または
                不法行為によりユーザーに生じた損害のうち特別な事情から生じた損害（運営者またはユーザーが損害発生に
                つき予見し、または予見し得た場合を含みます）について一切の責任を負いません。
              </p>
              <p>
                運営者は、当サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または
                紛争等について一切責任を負いません。
              </p>
              
              <h2>10. サービス内容の変更等</h2>
              <p>
                運営者は、ユーザーに通知することなく、当サービスの内容を変更しまたは当サービスの提供を中止することができるものとし、
                これによってユーザーに生じた損害について一切の責任を負いません。
              </p>
              
              <h2>11. 利用規約の変更</h2>
              <p>
                運営者は、必要と判断した場合には、ユーザーに通知することなく本規約を変更することができるものとします。
                なお、本規約の変更後、当サービスの利用を開始した場合には、当該ユーザーは変更後の規約に同意したものとみなします。
              </p>
              
              <h2>12. 個人情報の取扱い</h2>
              <p>
                当サービスの利用によって取得する個人情報については、運営者の「プライバシーポリシー」に従い適切に取り扱うものとします。
              </p>
              
              <h2>13. 通知または連絡</h2>
              <p>
                ユーザーと運営者との間の通知または連絡は、運営者の定める方法によって行うものとします。
                運営者は、ユーザーから、運営者が別途定める方式に従った変更届け出がない限り、現在登録されている連絡先が有効なものとみなして
                当該連絡先へ通知または連絡を行い、これらは、発信時にユーザーへ到達したものとみなします。
              </p>
              
              <h2>14. 権利義務の譲渡の禁止</h2>
              <p>
                ユーザーは、運営者の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、
                または担保に供することはできません。
              </p>
              
              <h2>15. 準拠法・裁判管轄</h2>
              <p>
                本規約の解釈にあたっては、日本法を準拠法とします。
                当サービスに関して紛争が生じた場合には、運営者の本店所在地を管轄する裁判所を専属的合意管轄とします。
              </p>
              
              <p className="text-right italic mt-8">
                制定日: 2023年12月1日<br />
                最終更新日: 2023年12月1日
              </p>
            </div>
            
            <div className="mt-12 flex justify-center">
              <Link href="/privacy" className="btn-primary mx-2">
                プライバシーポリシー
              </Link>
              <Link href="/contact" className="btn-secondary mx-2">
                お問い合わせ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}