var shell = require("shelljs");

function exec(command) {
  shell.exec("echo ---------------------------------------------------");
  shell.exec("echo " + command);
  shell.exec("echo ---------------------------------------------------");
  shell.exec(command)
}

exec("npm run build");
exec("git checkout -B gh-pages");
exec("git add -f build");
exec("git commit -a  -m 'rebuild-website'");
exec("git filter-branch -f --prune-empty --subdirectory-filter build");
exec("git push -f origin gh-pages");
exec("git checkout -");
