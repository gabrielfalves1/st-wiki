import { Component, OnInit } from '@angular/core';
import { Feedback } from 'src/app/model/feedback';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Storage } from '@ionic/storage-angular';
import { UtilsService } from 'src/app/services/util.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {
  constructor(
    private feedbackService: FeedbackService,
    private storage: Storage,
    private utilService: UtilsService
  ) {}
  feedback = new Feedback();
  isLoading = false;
  ngOnInit() {}

  async save() {
    await this.storage.create();
    const user = await this.storage.get('user');
    const id = user.id;
    try {
      this.isLoading = true;
      this.feedbackService
        .add(this.feedback, id)
        .then(async (res) => {
          this.utilService.alert(
            'Sucesso!',
            'Agradecemos pela sua colaboração! Sua opinião é muito importante para nós.'
          );
          this.feedback.message = '';
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
      this.utilService.alert(
        'Aviso',
        'Sistema indisponível, tente novamente mais tarde.'
      );
    } finally {
      this.isLoading = false;
    }
  }
}
