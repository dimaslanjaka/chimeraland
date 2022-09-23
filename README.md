# chimeraland
Unofficial Chimeraland Wikipedia

[![GitHub license](https://img.shields.io/github/license/dimaslanjaka/chimeraland?color=%232596be&label=License&logo=License&logoColor=%2321130d&style=for-the-badge)](https://github.com/dimaslanjaka/chimeraland)
[![GitHub stars](https://img.shields.io/github/stars/dimaslanjaka/chimeraland?style=for-the-badge)](https://github.com/dimaslanjaka/chimeraland/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/dimaslanjaka/chimeraland?style=for-the-badge)](https://github.com/dimaslanjaka/chimeraland/network)
[![GitHub size](https://img.shields.io/github/repo-size/dimaslanjaka/chimeraland?style=for-the-badge)](https://github.com/dimaslanjaka/chimeraland)

https://www.webmanajemen.com/chimeraland

reduce repository size
```
git reflog expire --all --expire=now
git gc --prune=now --aggressive
git push origin gh-pages --force
```
remove history commits
```
git checkout --orphan latest_branch
git add -A
git commit -am "initial commit (clean)"
git branch -D gh-pages
git branch -m gh-pages
git push -f origin gh-pages
```
