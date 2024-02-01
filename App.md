# App

Name: InOutTrack

O objectivo deste projeto é desenvolver uma solução que uma gestão eficiente dos elementos de equipas no que diz respeito ao trabalho presencial ou remoto por parte dos elementos da equipa.

O projeto surge na necessidades de garantir um numero minimo de elementos/colaboradores presentes na empresa. A equipa trabalha em um sistema mis de presenç

## RFs (Requisitos Funcionais)

- [ ] Deve ser possivel realizar o registo de novos utilizadores
- [ ] Deve ser possivel o utilizador realizar autenticação (login)
- [ ] Deve ser possível o utilizador registar para cada dia do mês (trabalho) se vai estar em:
        - Teletrabalho
        - Presencial
        - Licença
- [ ] Deve ser possível visualizar a estado relativamente se vais estar presente/ teletrabalho ou de licença de outros utilizadores
- [ ] Deve ser possível visualizar o histórico de todos utilizadores (esta informação não é confidencial)
- [ ] Deve ser possível realizar alteções da informa relativa ao tipo de trabalho.

- [ ] Deve ser possível realizar 


- Se estas teletrabalho ou presencial ou ausente

## RNs (Regras de Negócio)

- [ ] Só deve ser possivel alterar a escolha o tipo de trabalho (presencial, teletrabalho ou lincença) para datas futuras.
- [ ] A visualização dos dados só pode ser feita com o utilizador autenticado 


## Entidades

### User
- uuid
- Name
- FamilyName

### WorkType
- enum: Presential; Remote; Out Of Office

### Regist
- uuid
- date
- UserUUID
- Status: Enum[Presential; Remote; Out Of Office]

