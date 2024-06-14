import fn1 from './banner1'
import fn2 from './banner2'
import fn3 from './banner3'
import fn4 from './banner4'


function bannerConsole(){
  fn1()
  fn2()
  fn3()
  fn4()
}
function backendConsole() {
  let str = '====================================================================================================================\n'
  str += '                                                                                 _åå_\n'
  str += '                                                                                /    \\\n'
  str += '                          ©˙ ________                           ____ _     _____).COM(\n'
  str += '                            (___  ___)       _                 / ___) |   |  _  \\____/\n'
  str += '                               |  |_        | |               | |   | |   | |  \\ \\\n'
  str += '                               |  (_).__.__ | |___  ____ __ __| |   | |   | |  | |\n'
  str += '                               |  | | __ __\\|  _  \\/ __ \\  /_/| |   | |   | |  | |\n'
  str += '                               |  | | || || | (_) |  ___/| |  | |___| |___| |__/ /\n'
  str += '                                \\_|_|_||_||_\\_____/\\____/|_|   \\____)\\____)_____/\n'
  str += '                         ===++++++++======++++++++++++++==========+++++++============\n'
  str += '                                     :: System Framework ::  (V1.0.0.RELEASE)\n'
  str += '\n'
  str += '               欢迎使用 timbercld-sys-frame 系统管理(启航版) - Powered By https://www.timbercld.com/\n'
  str += '\n'
  str += '====================================================================================================================\n'
  console.log(str)
}
export {
  bannerConsole,
  backendConsole
}
