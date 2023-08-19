import { Component, OnInit } from '@angular/core';
import { apiConstant } from 'src/app/constants/api.constant';
import { responseConstant } from 'src/app/constants/response.constant';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
})
export class ErrorComponent implements OnInit {
  constructor(private commonService: CommonService) {}
  errorMessage: string = responseConstant.GENERIC_ERROR;
  ngOnInit(): void {}
}
