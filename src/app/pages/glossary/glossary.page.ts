import { Component, OnInit } from '@angular/core';
import { Acronym } from 'src/app/model/acronym';
import { AcronymsService } from 'src/app/services/acronyms.service';

@Component({
  selector: 'app-glossary',
  templateUrl: './glossary.page.html',
  styleUrls: ['./glossary.page.scss'],
})
export class GlossaryPage implements OnInit {
  constructor(private acronymService: AcronymsService) {}
  acronyms: Acronym[] = [];
  filteredAcronyms: Acronym[] = [];

  async ngOnInit() {
    await this.getAcronyms();
  }

  async getAcronyms() {
    try {
      const res = await this.acronymService.list();
      this.acronyms = <Acronym[]>res;
      this.filteredAcronyms = [...this.acronyms];
    } catch (error) {
      console.error('Erro ao buscar:', error);
    }
  }

  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredAcronyms = this.acronyms.filter((acronym) =>
      acronym.name.toLowerCase().includes(query)
    );
  }
}
