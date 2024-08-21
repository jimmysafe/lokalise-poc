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

  - TODO: [capire rollback](https://excalidraw.com/#json=MTtrTUVswpqGtKWIkRgNF,voTsu5rFY2HLRhdmgVJjkQ)
  - TODO: Controllo conflitti
    - Esempio: su branch A facciamo modifica a una chiave, su branch B facciamo modifica diversa su stessa chiave, Mergiamo B.. cosa succede?
      - DESIRED OUTPUT: Vince l'ultimo mergiato.

  ### [TODO] Flusso Design

  figma -> AGGIUNGERE/MODIFICARE/ELIMINARE CHIAVI -> push to design branch
