import { animate, style, transition, trigger } from '@angular/animations';
import { Component, NgZone, OnInit } from '@angular/core';
const { ipcRenderer, IpcRendererEvent, ipcMain } = window.require('electron');

@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class DataEntryComponent implements OnInit {

  inputData: string = '';
  savedData: string = '';
  errorMessage: string = '';


  ngOnInit(): void {
   this.readData()
  }

  constructor(private ngZone: NgZone) {
    // Listen for data from main process
    ipcRenderer.on('data-read', (event: any, data: string) => {
      console.log('drgr',data,'000')
      this.savedData = data;
    });
  }
  showElement: boolean = false;

  toggleElement() {
    this.showElement = !this.showElement;
  }
  saveData() {
    this.errorMessage = ''; // Clear any previous errors
    this.savedData = this.inputData
    ipcRenderer.send('save-data', this.inputData);
  }

  readData() {
    ipcRenderer.send('read-data');
  }
}
