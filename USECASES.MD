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
    - Modifica stringa ancora non approvata.
