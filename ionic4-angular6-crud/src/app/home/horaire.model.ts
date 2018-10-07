export class Semaine {
  semaineId: string;
  jours: Array<JourSemaine>;
}

export class Horaire {
  heureDebut: string;
  minuteDebut: string;
  heureFin: string;
  minuteFin: string;
  equipe: ChoixEquipe;
  libelleConge: string;
  nombreMinute: number;
  constructor(heureDebut: string, minuteDebut: string, heureFin: string, minuteFin: string, equipe: ChoixEquipe, libelleConge?: string) {
    this.heureDebut = heureDebut;
    this.minuteDebut = minuteDebut;
    this.heureFin = heureFin;
    this.minuteFin = minuteFin;
    this.equipe = equipe;
    this.nombreMinute = (+this.heureFin * 60 + +this.minuteFin) - (+this.heureDebut * 60 + +this.minuteDebut) - 20;
    this.libelleConge = libelleConge;
  }

}

export enum ChoixEquipe {
  matin = 0,
  aprem = 1,
  none = 2
}
export class JourSemaine {

   nom: string;
   classCss: string;
   isCheck: boolean;
   horaire: Horaire;
   constructor(nom: string, classCss: string, isCheck: boolean, horaire: Horaire) {
        this.nom = nom;
        this.classCss = classCss;
        this.isCheck = isCheck;
        this.horaire = horaire;
   }
}

export class Utils {


  afficherHoraire(horaire: Horaire): string {
    return !!horaire ? horaire.heureDebut  + 'h' + horaire.minuteDebut + ' - ' + horaire.heureFin + 'h' + horaire.minuteFin : '';
  }
  afficherConge(horaire: Horaire): string {
    return !!horaire ? horaire.libelleConge : '';
  }
}
