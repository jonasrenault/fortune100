import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnChanges, Input } from '@angular/core';
import { Company } from '../company';
import { RadarChartService } from '../radar-chart.service';


@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.css']
})
export class RadarChartComponent implements OnInit, OnChanges, AfterViewInit  {

  @Input() companies: Array<Company>;
  @ViewChild('container') element: ElementRef;

  private htmlElement: HTMLElement;

  constructor(private chartService: RadarChartService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.htmlElement = this.element.nativeElement;
    this.chartService.setup(this.htmlElement);
  }

  /**
  * Repopulate the graph when @Input changes
  **/
  ngOnChanges(): void {
    this.chartService.populate(this.companies);
  }

}
