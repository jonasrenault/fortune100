import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnChanges, Input } from '@angular/core';
import * as D3 from '../bundle-d3';
import { Company } from '../company';


@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.css']
})
export class RadarChartComponent implements OnInit, OnChanges, AfterViewInit  {

  @Input() company: Company;
  @ViewChild('container') element: ElementRef;

  private interval = 500;
  private host;
  private svg;
  private config;
  private axesList;
  private axisLabels;
  private totalAxes;
  private radius;
  private axes;
  private levels;
  private polygon;
  private points;
  private htmlElement: HTMLElement;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.htmlElement = this.element.nativeElement;
    this.host = D3.select(this.htmlElement);
    this.setup();
    this.buildSVG();
    this.drawAxes();
    this.drawLevels();
  }

  /**
  * Repopulate the graph when @Input changes
  **/
  ngOnChanges(): void {
    if (!this.host) return;
    this.populate();
  }

  /**
  * Setup the size and scale ranges.
  **/
  private setup(): void {
    this.config = {
      padding: {
        x: 400,
        y: 100
      },
      width: 300,
      height: 300,
      radians: 2 * Math.PI,
      levels: 5
    }
    this.axesList = ["careerOpportunitiesRating", "seniorLeadershipRating", "workLifeBalanceRating", "cultureAndValuesRating", "compensationAndBenefitsRating"];
    this.axisLabels = ['Career Opportunities', 'Senior Leadership', 'Work/Life Balance', 'Culture and Values', 'Compensation and Benefits'];
    this.totalAxes = this.axesList.length;
    this.radius = Math.min(this.config.width / 2, this.config.height / 2);
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
      .data(this.axesList).enter()
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

  private populate(): void {
    const points = this.getCoordinates(this.company);
    let pointsString = '';
    points.forEach(point => {
      pointsString += point.x + ',' + point.y + ' ';
    });
    const color = D3.interpolateBlues(this.company.overallRating * 0.2)
    if (!this.polygon) {
      this.polygon = this.svg.selectAll('.area')
      .data([this.company.name]).enter()
      .append('polygon')
      .attr('class', 'area')
      .attr('points', pointsString)
      .attr("stroke-width", "1.5px")
      .attr("stroke", color)
      .attr("fill", color)
      .attr("fill-opacity", 0.3)
      .attr("stroke-opacity", 1);

      const over = "ontouchstart" in window ? "touchstart" : "mouseover";
      const out = "ontouchstart" in window ? "touchend" : "mouseout";
      this.polygon
      .on(over, _ => {
        this.polygon.transition(250).attr("fill-opacity", 0.7);
      })
      .on(out, _ => {
        this.polygon.transition(250).attr("fill-opacity", 0.3);
      });
    } else {
      this.polygon.transition().duration(500).ease(D3.easeLinear)
      .attr('points', pointsString)
      .attr("fill", color)
      .attr("stroke", color);
    }

    if (!this.points) {
      this.points = this.svg.selectAll('.point').data(points)
      .enter()
      .append('circle')
      .attr('class', 'point')
      .attr('r', 4)
      .attr('cx', (d: any) => d.x)
      .attr('cy', (d: any) => d.y)
      .attr('fill', color);
    } else {
      this.points = this.svg.selectAll('.point').data(points);
      this.points.transition().duration(500).ease(D3.easeLinear)
      .attr('cx', (d: any) => d.x)
      .attr('cy', (d: any) => d.y)
      .attr('fill', color);
    }



    this.points.exit().remove();
  }

  private getCoordinates(company: Company): Array<any> {
    const maxValue = 5;
    const coords = [];
    this.axesList.forEach((prop, index) => {
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





}
