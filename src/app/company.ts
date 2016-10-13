export class Company {
  ceo: string;
  name: string;
  industry: string;
  overallRating: number;
  careerOpportunitiesRating: number;
  seniorLeadershipRating: number;
  workLifeBalanceRating: number;
  cultureAndValuesRating: number;
  compensationAndBenefitsRating: number;
  numberOfRatings: number;

  constructor(jsonObject: any) {
    this.name = jsonObject.name;
    this.industry = jsonObject.industryName;
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
  }
}
