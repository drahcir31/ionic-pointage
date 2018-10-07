import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ChoixEquipe, Horaire, JourSemaine, Semaine, Utils } from './horaire.model';
import { AppService } from '../app.service';
import { BehaviorSubject,  Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
  test: any;
  EQUIPE_MATIN = ChoixEquipe.matin;
  EQUIPE_APREM = ChoixEquipe.aprem;
  EQUIPE_NONE = ChoixEquipe.none;
  choixEquipe: ChoixEquipe;
  horaires: Array<Horaire>;
  choixHoraire: Horaire;
  data$: BehaviorSubject<Semaine>;
  sub: Subscription;
  subData: Subscription;
  semaineCourrante$ = new BehaviorSubject<Semaine>(undefined);
  utils = new Utils();
  jours: Array<JourSemaine>;
  semainesDispo: Array<string>;
  semaineChoisie$ = new BehaviorSubject<number>(0);
  spin$ = new BehaviorSubject<boolean>(true);
  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.horaires = new Array<Horaire>();
    this.horaires.push(new Horaire('05', '00', '12', '50', ChoixEquipe.matin));
    this.horaires.push(new Horaire('05', '00', '13', '45', ChoixEquipe.matin));
    this.horaires.push(new Horaire('12', '55', '20', '00', ChoixEquipe.aprem));
    this.horaires.push(new Horaire('13', '10', '20', '45', ChoixEquipe.aprem));
    this.horaires.push(new Horaire('05', '00', '12', '20', ChoixEquipe.none, 'CP'));
    this.horaires.push(new Horaire('05', '00', '12', '20', ChoixEquipe.none, 'JA'));
    this.horaires.push(new Horaire('05', '00', '12', '20', ChoixEquipe.none, 'RC'));
    this.horaires.push(new Horaire('05', '00', '12', '20', ChoixEquipe.none, 'CF'));
    this.horaires.push(new Horaire('05', '00', '12', '20', ChoixEquipe.none, 'JF'));
    this.horaires.push(new Horaire('00', '00', '24', '00', ChoixEquipe.none, 'JNT'));

    this.jours = new Array<JourSemaine>();
    this.jours.push(new JourSemaine('lundi', 'primary', true, null));
    this.jours.push(new JourSemaine('mardi', 'primary', true, null));
    this.jours.push(new JourSemaine('mercredi', 'primary', true, null));
    this.jours.push(new JourSemaine('jeudi', 'primary', true, null));
    this.jours.push(new JourSemaine('vendredi', 'primary', true, null));
    this.jours.push(new JourSemaine('samedi', 'medium', false, new Horaire('00', '00', '24', '00', ChoixEquipe.none, 'JNT')));
    this.jours.push(new JourSemaine('dimanche', 'medium', false, new Horaire('00', '00', '24', '00', ChoixEquipe.none, 'JNT')));
    this.appService.getAllSemaine().subscribe(d => {
      this.semaineChoisie$.next(d.length);
      this.semainesDispo = d;
      this.spin$.next(false);
    });
    this.sub = this.appService.getStorage('2018-1').subscribe(data => {
      this.data$ = new BehaviorSubject<any>(data);
      this.data$.subscribe(datas => {
        this.semaineCourrante$.next(datas);
        this.spin$.next(false);
      });
    });

  }

  changementEquipe(): void {
    if (this.choixEquipe == ChoixEquipe.matin) {
      this.choixHoraire = this.horaires[0];
    } else if (this.choixEquipe == ChoixEquipe.aprem) {
      this.choixHoraire = this.horaires[2];
    } else {
      this.choixHoraire = this.horaires[4];
    }
  }

  affecterHoraire(jours): void {
    if (!jours.length) {
      for (let j of this.jours) {
        jours.push(j);
      }
    }
    for (let j of jours) {
      if (!!j.isCheck) {
        j.horaire = this.choixHoraire;
      }
    }
  }

  enregistrerSemaine(numSemaine: string) {
    this.appService.setStorage(this.semaineCourrante$.getValue()).subscribe(data => {
      this.data$ = new BehaviorSubject<Semaine>(data);
    });
  }

  getSemaine(numSemaine: string) {
    return this.data$;
  }

  semainePrecedente(semaineCourante) {
    if (semaineCourante > 1) {
      this.semaineChoisie$.next(--semaineCourante);
      this.changerSemaine(semaineCourante);
    }
  }

  semaineSuivante(semaineCourante) {
      if (semaineCourante < this.semainesDispo.length) {
        this.semaineChoisie$.next(++semaineCourante);
        this.changerSemaine(semaineCourante);
      }
  }

  changerSemaine(nouvelleSemaine) {
    this.spin$.next(true);
    this.sub.unsubscribe();
    this.sub = this.appService.getStorage(this.semainesDispo[nouvelleSemaine - 1]).subscribe(data => {
      this.data$ = new BehaviorSubject<any>(data);
      this.data$.subscribe(datas => {
        this.spin$.next(false);
        this.semaineCourrante$.next(datas);
      });
    });
  }
  nouvelleSemaine(semaineChoisie)  {
    this.spin$.next(true);
    this.sub.unsubscribe();
    const nouvelleSemaine = Object.assign({}, this.semaineCourrante$.getValue());
    const tab = nouvelleSemaine.semaineId.split('-');
    nouvelleSemaine.semaineId = tab[0] + '-' + (+tab[1] + 1);
    this.appService.setStorage(nouvelleSemaine).subscribe(data => {
      this.data$ = new BehaviorSubject<Semaine>(data);
      this.appService.getAllSemaine().subscribe(d => {
        this.semaineCourrante$.next(data);
        this.semaineChoisie$.next(d.length);
        this.semainesDispo = d;
        this.spin$.next(false);
      });
    });
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.subData.unsubscribe();
  }

}
