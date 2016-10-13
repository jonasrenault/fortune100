import { Injectable } from '@angular/core';
import * as D3 from './bundle-d3';
import { Company } from './company';

@Injectable()
export class RadarChartService {

  private interval = 500;
  private host;
  private svg;
  private config;
  private axisProperties;
  private axisLabels;
  private totalAxes;
  private radius;
  private colorScale;
  private axes;
  private levels;
  private polygon;
  private points;
  private companies;

  constructor() {
    this.config = {
      margin : {
        top: 30,
        right: 100,
        bottom: 50,
        left: 100
      },
      padding: {
        x: 400,
        y: 100
      },
      width: 200,
      height: 200,
      radians: 2 * Math.PI,
      levels: 5,
    }
    this.axisProperties = ["careerOpportunitiesRating", "seniorLeadershipRating", "workLifeBalanceRating", "cultureAndValuesRating", "compensationAndBenefitsRating"];
    this.axisLabels = ['Career Opportunities', 'Senior Leadership', 'Work/Life Balance', 'Culture and Values', 'Compensation and Benefits'];
    this.totalAxes = this.axisProperties.length;
    this.radius = Math.min(this.config.width / 2, this.config.height / 2);
    this.colorScale = D3.scaleOrdinal(D3.schemeCategory20);
  }

  public setup(htmlElement: HTMLElement):void {
    this.host = D3.select(htmlElement);
    this.buildSVG();
    this.drawAxes();
    this.drawLevels();
  }

  /**
  * Build the SVG element.
  **/
  private buildSVG(): void {
    this.svg = this.host.append('svg')
    .attr('width', this.config.width + this.config.padding.x)
    .attr('height', this.config.height + this.config.padding.y)
    .append('g')
    // .attr('transform', 'translate(' + ((this.width - this.side) / 2) + ',' + (this.margin.top + 0.5) + ')')
    .attr('transform', 'translate(' + (this.config.width / 2) + ',' + (this.config.height / 4) + ')')
    .append('g');
  }

  /**
  * Draw the axes.
  **/
  private drawAxes(): void {
    this.axes = this.svg.selectAll('.axis')
    .data(this.axisLabels).enter()
    .append('g')
    .attr('class', d => 'axis ' + d);

    this.axes.append('line')
    .attr('class', 'axis-line')
    .attr("x1", this.config.width / 2)
    .attr("y1", this.config.width / 2)
    .attr("x2", (d, i) => { return this.config.width / 2 * (1 - Math.sin(i * this.config.radians / this.totalAxes)); })
    .attr("y2", (d, i) => { return this.config.height / 2 * (1 - Math.cos(i * this.config.radians / this.totalAxes)); })
    .attr("stroke", "grey")
    .attr("stroke-width", "1px");

    this.axes.append('text')
    .attr('class', 'label')
    .text((d:string) => d)
    .attr("text-anchor", "middle")
    .attr("x", (d, i) => { return this.config.width / 2 * (1 - 1.3 * Math.sin(i * this.config.radians / this.totalAxes)); })
    .attr("y", (d, i) => { return this.config.height / 2 * (1 - 1.1 * Math.cos(i * this.config.radians / this.totalAxes)); })
    .attr("font-family", "sans-serif")
  }

  private drawLevels(): void {
    this.levels = this.svg.selectAll(".levels")
    .append("g").attr("class", "levels");

    for (let level = 0; level < this.config.levels; level++) {
      let levelFactor = this.radius * ((level + 1) / this.config.levels);

      // build level-lines
      this.levels
      .data(this.axisLabels).enter()
      .append("line")
      .attr('class', 'level')
      .attr("x1", (d, i) => { return levelFactor * (1 - Math.sin(i * this.config.radians / this.totalAxes)); })
      .attr("y1", (d, i) => { return levelFactor * (1 - Math.cos(i * this.config.radians / this.totalAxes)); })
      .attr("x2", (d, i) => { return levelFactor * (1 - Math.sin((i + 1) * this.config.radians / this.totalAxes)); })
      .attr("y2", (d, i) => { return levelFactor * (1 - Math.cos((i + 1) * this.config.radians / this.totalAxes)); })
      .attr("transform", "translate(" + (this.config.width / 2 - levelFactor) + ", " + (this.config.height / 2 - levelFactor) + ")")
      .attr("stroke", "gray")
      .attr("stroke-width", "0.5px");
    }
  }

  public populate(companies: Array<Company>): void {
    if (!this.svg) return;
    const over = "ontouchstart" in window ? "touchstart" : "mouseover";
    const out = "ontouchstart" in window ? "touchend" : "mouseout";
    this.companies = this.svg.selectAll('.company').data(companies, company => company.name);

    this.companies.exit().remove();
    let enterSelection = this.companies.enter().append('g')
    .attr('class', (company: Company) => 'company ' + company.slug);

    enterSelection.append('polygon')
    .attr('class', 'area')
    .attr('points', (company:Company) => this.getCompanyCoordinatesString(company))
    .attr("stroke-width", "1.5px")
    .attr("stroke", (company:Company) => {
      company.color = this.colorScale(company.fortuneRanking);
      return this.colorScale(company.fortuneRanking);
    })
    .attr("fill", (company:Company) => this.colorScale(company.fortuneRanking))
    .attr("fill-opacity", 0.3)
    .attr("stroke-opacity", 1)
    .on(over, (company:Company) => {
      this.svg.selectAll('polygon').transition(200).attr("fill-opacity", 0.1);
      this.svg.selectAll('g.company.' + company.slug + ' polygon').transition(200).attr("fill-opacity", 0.7);
    })
    .on(out, _ => {
      this.svg.selectAll('polygon').transition(200).attr("fill-opacity", 0.3);
    });
  }

  private getCompanyCoordinates(company: Company): Array<any> {
    const maxValue = 5;
    const coords = [];
    this.axisProperties.forEach((prop, index) => {
      const val = company[prop];
      coords.push(
        {
          x: this.config.width / 2 * (1 - (val / maxValue) * Math.sin(index * this.config.radians / this.totalAxes)),
          y: this.config.height / 2 * (1 - (val / maxValue) * Math.cos(index * this.config.radians / this.totalAxes))
        }
      );
    });
    return coords;
  }

  private getCompanyCoordinatesString(company: Company): string {
    const coords = this.getCompanyCoordinates(company);
    let pointsString = '';
    coords.forEach(point => {
      pointsString += point.x + ',' + point.y + ' ';
    });
    return pointsString;
  }

}
