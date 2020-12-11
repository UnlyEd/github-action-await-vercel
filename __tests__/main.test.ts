import waitDeployment from '../src/waitDeployment'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'

require('dotenv').config({path: './.env.test'})


// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  const url = "nrn-v2-mst-aptd-gcms-lcz-sty-c1-hfq88g3jt.vercel.app";
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: {
      "INPUT_URL-TO-WAIT": url,
      "VERCEL_TOKEN": process.env.VERCEL_TOKEN
    }
  }
  console.log(options)
  try {
    console.log(cp.execFileSync(np, [ip], options).toString())

  } catch (e) {
    console.log(e);
  }
})
