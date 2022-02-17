import { exec } from 'child_process'
import { type Stream } from 'stream';

async function streamToString(stream: Stream): Promise<string> {
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on('error', (err) => reject(err));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    })
}



export async function getLatestCommitMesssage(): Promise<string> {
    const { stdout } = await exec('git log -1 --pretty=%B');

    const msg = await streamToString(stdout!);

    return msg.trim()
}