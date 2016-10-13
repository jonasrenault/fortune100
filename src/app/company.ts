export class Company {
  ceo: string;
  name: string;
  slug: string;
  industry: string;
  fortuneRanking: number;
  overallRating: number;
  careerOpportunitiesRating: number;
  seniorLeadershipRating: number;
  workLifeBalanceRating: number;
  cultureAndValuesRating: number;
  compensationAndBenefitsRating: number;
  numberOfRatings: number;
  checked: boolean;
  color: string;

  constructor(jsonObject: any) {
    this.name = jsonObject.name;
    this.industry = jsonObject.industryName;
    this.fortuneRanking = jsonObject.fortuneRanking;
    this.overallRating = jsonObject.overallRating;
    this.careerOpportunitiesRating = jsonObject.careerOpportunitiesRating;
    this.seniorLeadershipRating = jsonObject.seniorLeadershipRating;
    this.workLifeBalanceRating = jsonObject.workLifeBalanceRating;
    this.cultureAndValuesRating = jsonObject.cultureAndValuesRating;
    this.compensationAndBenefitsRating = jsonObject.compensationAndBenefitsRating;
    this.numberOfRatings = jsonObject.numberOfRatings;
    if (jsonObject.hasOwnProperty("ceo")) {
      this.ceo = jsonObject.ceo.name;
    }
    this.setCompanySlug();
  }

  private setCompanySlug(): void {
    this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]+/g,'');
  }
}
