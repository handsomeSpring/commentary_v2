import FtpDeploy from 'ftp-deploy';

import secret from './secret.json' assert { 'type': 'json' };
console.log('————开始发送文件————');
const ftp = new FtpDeploy();
ftp.deploy({
    'deleteRemote': true,
    'forcePasv': false,
    'include': [
        '*',
        '**/*',
    ],
    'port': 21,
    'remoteRoot': '/',
    'sftp': false,
    ...secret,
}).then(() => {
    console.log('————发送完成————');
})
    .catch((error) => {
        console.error(error);
    });
ftp.on(
    'uploading',
    (data) => {
        console.clear();
        console.log(`已传输文件数：${data.transferredFileCount} / ${data.totalFilesCount}`);
        console.log(`正在上传文件：${data.filename}`);
    }
);
