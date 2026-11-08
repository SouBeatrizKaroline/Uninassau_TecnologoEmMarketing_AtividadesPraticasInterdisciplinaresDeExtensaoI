# Conexão Digital: Informação, Redes e Segurança — Operação Fio Vermelho

Jogo investigativo estilo detetive desenvolvido para o projeto de extensão **Conexão Digital: Informação, Redes e Segurança**, do curso de **Tecnologia em Marketing da UNINASSAU** (Polo Camaragibe, PE).

O objetivo é apoiar jovens e adultos a verificar informações antes de compartilhar, reconhecer como algoritmos e anúncios influenciam suas decisões e proteger seus dados contra golpes digitais.

## A Investigação: Operação Fio Vermelho

Na atividade principal **Operação Fio Vermelho**, o jogador assume a credencial de investigador da Divisão de Perícia Digital em Camaragibe (PE) ao lado da **Inspetora Lia**. Ao longo de **oito casos fictícios**, o detetive analisa publicações, cabeçalhos de e-mail, anúncios com gatilhos de urgência e conversas simuladas de WhatsApp e SMS, reúne provas no dossiê e decide como confirmar se uma mensagem é legítima por um canal independente.

| Caso | Local no Distrito | Foco da Perícia Digital |
| --- | --- | --- |
| **01 · O detetive do feed** | Praça do Bairro | Examinar perfil, metadados de imagem recortada, legenda alarmista e reações; montar dossiê e cruzar com o boletim oficial. |
| **02 · O recorte fora de hora** | Redação | Organizar registros cronológicos no quadro forense para comprovar a descontextualização de um cartaz antigo. |
| **03 · Por trás da tela** | Sala do Feed | Operar o monitor de recomendações e observar como cliques alimentam o ruído algorítmico ou fortalecem o sinal útil. |
| **04 · O anúncio de cinco minutos** | Agência | Auditar uma oferta viral na bancada de perícia, revelando patrocínio oculto, falso cronômetro de escassez e condições omitidas. |
| **05 · O suporte que pediu o código** | Caixa de Entrada | Inspecionar remetente, testar o destino do botão em ambiente seguro e identificar armadilhas de phishing e roubo de código de 6 dígitos. |
| **06 · Modo proteção** | Central de Segurança | Equipar três defesas (senha exclusiva, autenticação em dois fatores e canal oficial) e simular resistência a ataques reais. |
| **07 · Plantão de golpes** | Plantão de Golpes | Triagem forense de cinco golpes digitais: pedido de Pix por número desconhecido no WhatsApp, falso sequestro, link suspeito de taxa de entrega (SMS), e-mail com remetente falsificado (*spoofing*) e boleto adulterado. |
| **08 · Operação Fio Vermelho** | Arquivo Central | Ouvir o relato recuperado de testemunha no WhatsApp e esticar o fio vermelho no quadro de cortiça para conectar as provas da operação. |

Cada caso possui três etapas (**1/3 · Briefing**, **2/3 · Investigação / Perícia** e **3/3 · Relatório Forense**), além de **Lupa Forense** com dicas periciais e efeitos sonoros sintetizados via Web Audio API (com botão de mudo). A conclusão de cada caso rende **60 XP**, uma estrela, um carimbo de arquivamento e um distintivo. As oito estrelas desbloqueiam a insígnia máxima **Guardião Digital**.

## Referências para o plantão

- [Polícia Civil do Paraná · Falso sequestro](https://www.policiacivil.pr.gov.br/Noticia/PCPR-e-PMPR-localizam-crianca-vitima-de-golpe-do-falso-sequestro-em-Mambore)
- [Anatel · Golpes atuais mais comuns](https://www.gov.br/anatel/pt-br/assuntos/dicas-contra-fraudes/modelo-de-capa-2/golpes-atuais-mais-comuns)
- [Agência de Segurança Cibernética de Singapura · E-mails de extorsão e remetentes falsificados](https://www.csa.gov.sg/alerts-and-advisories/advisories/ad-2024-017/)

## Uso na ação de extensão

- **Antes da partida** — converse sobre a última vez em que um título urgente ou pedido inesperado de Pix chamou a atenção de alguém.
- **Durante a partida** — peça à turma para comparar dossiês, usar a Lupa Forense nos alertas do plantão e observar o efeito das interações no feed.
- **Depois da partida** — consulte o **Manual de Campo Anti-Golpes** integrado ao Diário e convide cada pessoa a registrar um protocolo de segurança que pretende adotar.

## Acessibilidade e privacidade

Os controles funcionam por teclado, toque ou mouse, e os avisos das missões são anunciados a leitores de tela (`aria-live`). O avatar, o progresso e a reflexão ficam salvos apenas no armazenamento local do navegador (`localStorage`). O jogo funciona 100% offline/localmente sem cadastro, câmera ou coleta de dados.
