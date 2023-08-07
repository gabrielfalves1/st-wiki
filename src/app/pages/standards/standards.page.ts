import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-standards',
  templateUrl: './standards.page.html',
  styleUrls: ['./standards.page.scss'],
})
export class StandardsPage implements OnInit {
  constructor() { }

  ngOnInit() { }

  redirectToURL() {
    const url =
      'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes';
    window.open(url, '_blank');
  }
}
