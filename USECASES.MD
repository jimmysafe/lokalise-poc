## Use Cases

### Open PR

- Aggiunta a stringhe a diversi file ✅
- Aggiunta stringhe diversi file (_Secondo Commit_) Task gia completati
  - [✅] BUG: Comment task: 1 sola nuova riga in tabella. manca un task.
  - [✅] BUG: Modificando una stringa che gia esiste su un task, la pipeline da errore ( All of the keys are locked or already have assigned tasks ). Idealmente vorremmo non throwasse un errore, ma solo un log.
- Aggiunte stringhe in diversi file in diversi commit.
  - ✅ DESIRED OUTPUT: Un task per ogni commit con solo le modifiche fatte nel commit.
  - ADDITIONAL TESTS:
    - Modifica stringa approvata.
      - ✅ DESIRED OUTPUT: crea un altro task con modifica.
    - Modifica stringa ancora non approvata.
      - ✅ DESIRED OUTPUT: aggiorna task con stringa non ancora approvata
- Aggiunta stringhe con chiavi uguali

  - Chiavi uguali stesso file (?)
  - Chiavi uguali file diversi

  ### Automerge

  - ✅ [capire rollback](https://excalidraw.com/#json=MTtrTUVswpqGtKWIkRgNF,voTsu5rFY2HLRhdmgVJjkQ)
  - TODO: Controllo conflitti
    - Esempio: su branch A facciamo modifica a una chiave, su branch B facciamo modifica diversa su stessa chiave, Mergiamo B.. cosa succede?
      - DESIRED OUTPUT: Vince l'ultimo mergiato.

  ### [TODO] Flusso Design

  figma -> AGGIUNGERE/MODIFICARE/ELIMINARE CHIAVI -> push to design branch poi?

  CONVERSAZIONE PM - DEV -DES

  PM: famo il diario!
  DES: ok disegno e mi sento con i traduttori.
  --- DESIGN COMPLETATO E ABBIAMO SIA IT, ES, FR, su lokalise (branch design) READY.

  DES: Ao developer, sta tutto sul branch di design.. divertitevi.
  PS: DES non sanno su che file e molto probabilmente non sanno fare le keys anche se glielo spieghiamo 300 volte.

  DEV: Grazie, controllo subito e vedo che casino avete fatto con le chiavi e su che file inesistenti avete messo ste chiavi.

COME FACILITIAMO IL FLUSSO DEI DEV UNA VOLTA CHE DESIGN E TRADUTTORI HANNO FINITO E PUSHATO SU BRANCH DESIGN? T(KEY.VALUE)

- WEBHOOK listens to key/translation change on `design` branch. It will fire and create new PR with changes (to be merged into repo master branch).
  - PRO: Devs awareness of when and what have changed / is ready.
  - PRO: Control over what gets merged into master and goes to prod.
