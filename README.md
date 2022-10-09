# chimeraland
Unofficial Chimeraland Wikipedia Builder

- [source branch](https://github.com/dimaslanjaka/chimeraland/tree/gh-pages)
- [public url](https://www.webmanajemen.com/chimeraland)

[![GitHub license](https://img.shields.io/github/license/dimaslanjaka/chimeraland?color=%232596be&label=License&logo=License&logoColor=%2321130d&style=for-the-badge)](https://github.com/dimaslanjaka/chimeraland)
[![GitHub stars](https://img.shields.io/github/stars/dimaslanjaka/chimeraland?style=for-the-badge)](https://github.com/dimaslanjaka/chimeraland/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/dimaslanjaka/chimeraland?style=for-the-badge)](https://github.com/dimaslanjaka/chimeraland/network)
[![GitHub size](https://img.shields.io/github/repo-size/dimaslanjaka/chimeraland?style=for-the-badge)](https://github.com/dimaslanjaka/chimeraland)

## reduce repository size
```bash
# remove old logs
git reflog expire --all --expire=now
# remove the old files
git gc --prune=now --aggressive
# remove the old files
git gc --aggressive --prune=all
# force push cleaned objects
git push origin master --force
```

## remove history commits
```
git checkout --orphan latest_branch
git add -A
git commit -am "initial commit (clean)"
git branch -D master
git branch -m master
git push -f origin master
```

## Snapshot
using `snapshot3.ts`, `ssg.ts`

## Deploy
using `gulp`

## Build
1st terminal
```bash
gulp copy
```
open new 2nd terminal
```bash
ts-node ssg.ts # wait until finish
```
back to 1st terminal
```
gulp safelink
gulp deploy
``