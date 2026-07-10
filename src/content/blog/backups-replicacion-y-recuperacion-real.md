---
title: "Backups, replicación y recuperación real: tres cosas distintas"
publishDate: 2026-07-06
tags:
  - seguridad
  - continuidad
  - cloud
description: "Tener copias no garantiza continuidad. La diferencia está en cómo se valida la recuperación."
draft: false
---

## Copiar no es recuperar

Una copia puede existir y seguir sin resolver el problema principal: cuánto tardas en volver a operar. Por eso conviene separar tres conceptos que muchas veces se mezclan.

## Backup

El backup protege frente a borrados, corrupción o necesidad de recuperar un estado anterior. Su valor depende de la política de retención, del almacenamiento y de la facilidad para restaurar.

## Replicación

La replicación busca reducir tiempo de caída, pero no sustituye una copia histórica. Si replicas un error o un borrado, el problema también viaja al destino.

## Recuperación validada

La parte que más se olvida es probar de verdad. Una estrategia de continuidad necesita ejercicios de restauración, revisión de tiempos y validación de dependencias: credenciales, red, DNS, datos y acceso de usuarios.

## Qué revisar primero

Empiezo siempre por tres preguntas:

- ¿Qué servicio no puede parar?
- ¿Cuánto tiempo real puede estar caído?
- ¿Quién ejecuta la recuperación y con qué pasos?

Responder eso suele aclarar si hace falta solo una mejor política de copias o una estrategia más amplia de continuidad.
