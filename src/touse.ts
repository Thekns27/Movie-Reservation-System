/**
 * 
src/core/accounting/application/use-cases/get-cash-flow.usecase.ts
@Injectable()
export class GetCashFlowUseCase {
  async execute(query: GetCashFlowQueryDto) {
    const data = await this.bookkeepingRepo.getAggregatedData(query.start, query.end);

    const calc = (types: string[], isCreditPositive = true) => {
      const filtered = data.filter(i => types.includes(i.accountHead.accountType.name.toUpperCase()));
      const items = filtered.map(i => ({
        name: i.accountHead.name,
        // Cash Flow မှာ Asset တိုးရင် အနှုတ် (-), Asset လျော့ရင် အပေါင်း (+)
        amount: isCreditPositive ? (Number(i._sum.credit) - Number(i._sum.debit)) : (Number(i._sum.debit) - Number(i._sum.credit))
      }));
      return { items, total: items.reduce((s, x) => s + x.amount, 0) };
    };

    // ၁။ Operating Activities (P&L က Net Profit ကို အခြေခံ)
    const netProfit = await this.getPnlNetProfit(query); 
    const workingCapitalChanges = calc(['ASSETS', 'LIABILITIES'], false);

    // ၂။ Investing Activities (Fixed Assets)
    const investing = calc(['FIXED_ASSETS'], false);

    // ၃။ Financing Activities (Equity, Loans)
    const financing = calc(['EQUITY', 'LIABILITY_LONG_TERM']);

    return {
      operatingNetCash: netProfit + workingCapitalChanges.total,
      investingNetCash: investing.total,
      financingNetCash: financing.total,
      netIncreaseInCash: (netProfit + workingCapitalChanges.total) + investing.total + financing.total
    };
  }
}
-----------------
src/core/accounting/application/services/accounting-calc.service.ts

@Injectable()
export class AccountingCalcService {
  // P&L ရော Cash Flow အတွက်ပါ အသုံးဝင်မယ့် General Function
  calculateTotal(data: any[], types: string[], isRevenue = false) {
    const filtered = data.filter(i => 
      types.some(t => t.toUpperCase() === i.accountHead.accountType.name.toUpperCase())
    );

    const items = filtered.map(i => {
      const dr = Number(i._sum.debit) || 0;
      const cr = Number(i._sum.credit) || 0;
      return {
        name: i.accountHead.name,
        // Revenue/Liability တိုးရင် Credit-Debit, Asset တိုးရင် Debit-Credit
        amount: isRevenue ? (cr - dr) : (dr - cr)
      };
    });

    return { items, total: items.reduce((sum, item) => sum + item.amount, 0) };
  }
}
  ---------------------
  src/core/accounting/application/use-cases/get-cash-flow.usecase.ts
  @Injectable()
export class GetCashFlowUseCase {
  constructor(
    private readonly calcService: AccountingCalcService,
    private readonly pnlUseCase: GetProfitAndLossUseCase, // P&L logic ကို ယူသုံးမယ်
    @Inject(REPOSITORY_TOKEN.BOOKKEEPING) private readonly repo: IBookkeepingRepository,
  ) {}

  async execute(query: GetCashFlowQueryDto) {
    const aggregatedData = await this.repo.getProfitAndLossData(query.startDate, query.endDate);

    // ၁။ Operating Activities - Net Profit ကို P&L usecase ကနေ လှမ်းယူမယ်
    const pnlReport = await this.pnlUseCase.execute(query.companyId, query);
    const netProfitBeforeTax = pnlReport.netProfit;

    // ၂။ Adjustments (Depreciation, etc.)
    const adjustments = this.calcService.calculateTotal(aggregatedData, ['NON_CASH_EXPENSE']);

    // ၃။ Working Capital Changes (Assets/Liabilities အတိုးအလျော့)
    // Asset တိုးရင် Cash လျော့လို့ (isRevenue: false) နဲ့ တွက်ရမယ်
    const arChanges = this.calcService.calculateTotal(aggregatedData, ['ASSETS'], false);
    const apChanges = this.calcService.calculateTotal(aggregatedData, ['LIABILITIES'], true);

    // ၄။ Investing & Financing
    const investing = this.calcService.calculateTotal(aggregatedData, ['FIXED_ASSET'], false);
    const financing = this.calcService.calculateTotal(aggregatedData, ['EQUITY', 'LOAN'], true);

    const netCashFromOps = netProfitBeforeTax + adjustments.total - arChanges.total + apChanges.total;

    return {
      operatingActivities: { netProfitBeforeTax, adjustments, workingCapital: { arChanges, apChanges }, netCashFromOps },
      investingActivities: investing,
      financingActivities: financing,
      netIncreaseInCash: netCashFromOps + investing.total + financing.total
    };
  }
}

 */