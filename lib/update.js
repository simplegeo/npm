/*
for each pkg in prefix that isn't a git repo
  look for a new version of pkg that satisfies dep
  if so, install it.
  if not, then update it
*/

module.exports = update

update.usage = "npm update [pkg]"

var npm = require("./npm.js")
  , lifecycle = require("./utils/lifecycle.js")
  , asyncMap = require("slide").asyncMap
  , log = require("./utils/log.js")

update.completion = npm.commands.outdated.completion

function update (args, cb) {
  npm.commands.outdated(args, true, function (er, outdated) {
    log(outdated, "outdated updating")
    if (er) return cb(er)

    asyncMap(outdated, function (ww, cb) {
      // [[ dir, dep, has, want ]]
      var where = ww[0]
        , dep = ww[1]
        , want = ww[3]
        , what = dep + "@" + want

      npm.commands.install(where, what, cb)
    }, cb)
  })
}
