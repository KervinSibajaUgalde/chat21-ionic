import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IonTextarea } from '@ionic/angular';
import { Chooser } from '@ionic-native/chooser/ngx';
import { ModalController } from '@ionic/angular';

// pages
import { LoaderPreviewPage } from 'src/app/pages/loader-preview/loader-preview.page';
// services 
import { UploadService } from 'src/chat21-core/providers/abstract/upload.service';
// utils
import { TYPE_MSG_TEXT } from 'src/chat21-core/utils/constants';
// models
import { UploadModel } from 'src/chat21-core/models/upload';

@Component({
  selector: 'app-message-text-area',
  templateUrl: './message-text-area.component.html',
  styleUrls: ['./message-text-area.component.scss'],
})
export class MessageTextAreaComponent implements OnInit {
  @Output() eventChangeTextArea = new EventEmitter<object>();
  @Output() eventSendMessage = new EventEmitter<object>();

  public conversationEnabled = false;
  public messageString: string;

  TYPE_MSG_TEXT = TYPE_MSG_TEXT;

  constructor(
    public chooser: Chooser,
    public modalController: ModalController,
    public uploadService: UploadService
  ) { }

  ngOnInit() {
    // this.setSubscriptions();
  }

  onChange(e: any) {
    const codeChar = e.detail.data;
    let message = e.detail.target.innerHTML;
    if (e.detail.data) {
      message += e.detail.data;
    }
    const height = e.detail.target.offsetHeight;
    console.log('onChange ************** event:: ', message);
    if ( codeChar === 10 ) {
      console.log('premuto invio ');
    } else {
      try {
        if ( message.trim().length > 0 ) {
          this.conversationEnabled = true;
        } else {
          this.conversationEnabled = false;
        }
      } catch (err) {
        this.conversationEnabled = false;
      }
      this.eventChangeTextArea.emit({ msg: message, offsetHeight: height } );
    }
  }


  // attualmente non usata
  // dovrebbe scattare quando termina il caricamento dell'immagine per inviare il messaggio
  private setSubscriptions() {
    const that = this;
    const subscribeBSStateUpload =  this.uploadService.BSStateUpload.subscribe((data: any) => {
      console.log('***** BSStateUpload *****', data);
      if (data) {
        let message = data.message;
        let type_message = data.type_message;
        let metadata = data.metadata;
        console.log('***** message *****', message);
        console.log('***** type_message *****', type_message);
        console.log('***** metadata *****', metadata);
        //this.eventSendMessage.emit({ message: messageString, type: TYPE_MSG_TEXT });
      }
    });
  }

  /**
   * 
   * @param event
   */
  // public messageChange(event) {
  //   const that = this;
  //   try {
  //     if (event) {
  //       console.log("event.value:: ", event);
  //       var str = event.value;
  //       that.setWritingMessages(str);
  //       setTimeout(function () {
  //         var pos = str.lastIndexOf("/");
  //         console.log("str:: ", str);
  //         console.log("pos:: ", pos);
  //         if(pos >= 0 ) {
  //           // && that.tagsCanned.length > 0
  //           var strSearch = str.substr(pos+1);
  //           that.loadTagsCanned(strSearch);
  //           //that.showTagsCanned(strSearch);
  //           //that.loadTagsCanned(strSearch);
  //         } else {
  //           that.tagsCannedFilter = [];
  //         }
  //       }, 300);
  //       that.resizeTextArea();
  //     }
  //   } catch (err) {
  //     console.log("error: ", err)
  //   }    
  // }

  /**
   * invocata dalla pressione del tasto invio sul campo di input messaggio
   * se il messaggio non è vuoto lo passo al metodo di controllo
   */
  pressedOnKeyboard(e: any, text: string) {
    console.log('pressedOnKeyboard ************** event:: ', e);
    const message = e.target.textContent.trim();
    if ( e.inputType === 'insertLineBreak' && message === '' ) {
      this.messageString = '';
      return;
    } else {
      this.messageString = '';
      this.sendMessage(text);
    }
  }

  /** */
  sendMessage(text: string) {
    console.log('sendMessage', text);
    this.messageString = '';
    text = text.replace(/(\r\n|\n|\r)/gm, '');
    if (text.trim() !== '') {
      this.eventSendMessage.emit({ message: text, type: TYPE_MSG_TEXT });
    }
  }

  /** su mobile !!!*/
  onFileSelectedMobile(e: any) {
    console.log('controlOfMessage');
    this.chooser.getFile()
    .then(file => {
      console.log(file ? file.name : 'canceled');
    })
    .catch((error: any) => {
      console.error(error);
    });
  }

  onFileSelected(e: any){
    console.log('controlOfMessage', e);
    this.presentModal(e);
  }





  /**
   * 
   * @param e 
   */
  private async presentModal(e: any): Promise<any> {
    const that = this;
    console.log('presentModal', e);
    console.log('presentModal', e.target);
    console.log('presentModal', e.target.files);
    console.log('presentModal', e.target.files.length);
    const dataFiles = e.target.files;
    const attributes = { files: dataFiles, enableBackdropDismiss: false };
    const modal: HTMLIonModalElement =
       await this.modalController.create({
          component: LoaderPreviewPage,
          componentProps: attributes,
          swipeToClose: false,
          backdropDismiss: true
    });
    modal.onDidDismiss().then((detail: any) => {
      let fileSelected = e.target.files.item(0);//detail.data.fileSelected;
      let messageString = detail.data.messageString;
      let metadata = detail.data.metadata;
      let type = detail.data.type;
      console.log('The result: CHIUDI!!!!!', detail.data);
      if (detail !== null) {
        const currentUpload = new UploadModel(fileSelected);
        let uploadTask = that.uploadService.pushUploadMessage(currentUpload);
        console.log('invio msg uploadTask::: ', uploadTask);
        // send message
        this.eventSendMessage.emit({ message: messageString, type: type, metadata: metadata });
      }
   });
    return await modal.present();
  }

  /**
   * 
   */
  private async closeModal() {
    console.log('closeModal', this.modalController);
    await this.modalController.getTop();
    this.modalController.dismiss({ confirmed: true });
  }
}
