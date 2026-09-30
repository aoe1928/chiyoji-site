import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

export const tools = [
  {
    id: 'note-catcher', name: 'Note Catcher', platform: 'Ableton Live / Max for Live',
    title: ['欲しいMIDIノートだけ、欲しい音へ。', 'Pick your notes. Remap each pitch.'],
    text: ['別トラックのMIDIノートを受け取り、音ごとに変換するMax for Liveデバイス。オクターブ別の12音グリッドで複数選択し、C0→C1、D0→E1のように割り当てられます。', 'Receive MIDI notes from another track and remap each pitch with this Max for Live device. Select notes across an octave grid and assign mappings such as C0 to C1 and D0 to E1.'],
    setup: ['配布ZIPを展開し、AMXD・3つのJS・画像を同じフォルダーに置いて使います。受信側MIDIトラックの音源より前に挿入。図入り日本語マニュアルを同梱しています。', 'Extract the release ZIP and keep the AMXD, three JS files and image together. Insert it before the instrument on a receiving MIDI track. An illustrated Japanese manual is included.'],
    limits: ['Windows / Live 11.3.43 / Max 8.5.8でMIDI変換を実機確認。Live 12・macOS・高負荷時は未検証。音声や音源内部のグルーブの直接変換、ノート以外のMIDIメッセージには対応していません。', 'MIDI remapping checked on Windows / Live 11.3.43 / Max 8.5.8. Live 12, macOS and heavy-load timing are unverified. It processes notes, not audio, instrument-internal grooves or other MIDI messages.'],
    href: 'https://github.com/aoe1928/note-catcher/releases/latest', repo: 'https://github.com/aoe1928/note-catcher', download: true,
    license: ['コード・文書はMIT。画像・キャラクター・画面画像は対象外です。', 'Code and documentation: MIT. Images, character artwork and screenshots are excluded.'],
  },
  {
    id: 'live-bridge', name: 'Live Bridge', platform: 'Ableton Live / MCP',
    title: ['AIとの会話を、Liveの操作につなぐ。', 'Connect your AI workflow to Ableton Live.'],
    text: ['CodexなどのMCPクライアントから、トラックやMIDIノートの読み取り・編集、ミキサー操作などを行うブリッジ。Max for Liveデバイスとローカルサーバーを組み合わせて使います。', 'Read and edit tracks and MIDI notes, control the mixer and more from MCP clients such as Codex. Live Bridge combines a Max for Live device with a local server.'],
    setup: ['Node.js 20以降とMax for Liveが必要です。GitHubの手順で各PCにセットアップし、1つのLive Setにブリッジを1つ配置します。プラグイン検索・挿入にはRemote Scriptも使用します。', 'Requires Node.js 20+ and Max for Live. Follow the GitHub setup guide on each computer and use one bridge per Live Set. Plugin search and insertion also use a Remote Script.'],
    limits: ['Windows / Live 11で一部の操作を実機確認。Live 12・macOSとv0.10の追加機能は実機未検証。生成デバイスにはPC固有のトークンが含まれるため、公開配布せず各PCで生成してください。', 'Selected workflows checked on Windows / Live 11. Live 12, macOS and the v0.10 additions have not been verified in Live. Generated devices contain a machine-specific token; generate them on each computer instead of redistributing them.'],
    href: 'https://github.com/aoe1928/live-bridge#setup', repo: 'https://github.com/aoe1928/live-bridge', download: false,
    license: ['コード・文書はMIT。画像・キャラクター素材は、デバイスに埋め込まれたものも含め対象外です。', 'Code and documentation: MIT. Images and character artwork, including embedded copies, are excluded.'],
  },
  {
    id: 'py-img-tool', name: 'py-img-tool', platform: 'Python / Pillow',
    title: ['画像をまとめて、小さく使いやすく。', 'Resize and convert a batch of images.'],
    text: ['画像やフォルダーを指定して、最大横幅に合わせた縮小とJPEG・WebPへの変換をまとめて行うスクリプト。変換後は別フォルダーへ保存し、同名ファイルには連番を付けます。', 'Resize images to a maximum width and convert them to JPEG or WebP. Results go into a separate folder, with numbered filenames to avoid overwriting existing output.'],
    setup: ['Python 3とPillowを用意し、リポジトリのimg.pyを実行します。引数なしの対話モードとコマンドライン指定に対応しています。', 'Install Python 3 and Pillow, then run img.py from the repository. Use interactive mode without arguments or pass files and options on the command line.'],
    limits: ['フォルダーの直下のみを処理します。RGBへ変換するため透過は保持しません。この掲載作業では各OS上での動作は再検証していません。', 'Processes files directly inside a folder, without recursion. RGB conversion does not preserve transparency. Runtime behavior on each OS was not retested for this listing.'],
    href: 'https://github.com/aoe1928/py-img-tool', repo: 'https://github.com/aoe1928/py-img-tool', download: false,
    license: ['', ''],
  },
  {
    id: 'safe-eject', name: 'safe_eject', platform: 'macOS / Zsh',
    title: ['ドライブの取り出しを、まとめて実行。', 'Eject mounted volumes in sequence.'],
    text: ['Time Machineのバックアップを停止・待機してから、キャッシュを書き出し、対象ボリュームを順番に取り出すMac用スクリプトです。', 'A Mac script that stops an active Time Machine backup, waits for it, flushes cached writes and attempts to eject volumes in sequence.'],
    setup: ['公開コードのsafe_eject.shを確認し、対象・除外条件を自分の環境に合わせてからZshで実行してください。', 'Review safe_eject.sh and adapt its target and exclusion rules to your environment before running it with Zsh.'],
    limits: ['公開コードはボリューム名の除外リスト方式で、取り外し可能ディスクの自動判別ではありません。READMEと実装に差があり、現行macOSでの動作も未検証のため、参考スクリプトとして掲載しています。', 'The published code uses a volume-name exclusion list, not automatic removable-disk detection. The README differs from the implementation, and current macOS behavior is unverified. Listed as a reference script.'],
    href: 'https://github.com/aoe1928/safe_eject', repo: 'https://github.com/aoe1928/safe_eject', download: false,
    license: ['', ''],
  },
];

export default function MoreTools({ en, id }: { en: boolean; id: string }) {
  const lang = en ? 1 : 0;
  return <>{tools.filter(tool => tool.id === id).map(tool => <Box component="article" id={tool.id} key={tool.id} sx={{ scrollMarginTop: 24, mt: 2 }}>
    <Chip label={tool.platform} size="small" sx={{ color: '#b9ffbd', bgcolor: 'rgba(102,255,102,0.07)', mb: 2 }} />
    <Typography component="h1" sx={{ fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', fontWeight: 850 }}>{tool.name}</Typography>
    <Typography sx={{ color: '#ffb6c1', fontSize: '1.2rem', fontWeight: 700, mt: 1, mb: 2 }}>{tool.title[lang]}</Typography>
    <Typography sx={{ lineHeight: 1.9 }}>{tool.text[lang]}</Typography>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mt: 3 }}>
      <Box><Typography component="h3" sx={{ color: '#b9ffbd', fontWeight: 800, mb: 1 }}>{en ? 'Getting started' : '使い始めるには'}</Typography><Typography sx={{ lineHeight: 1.9 }}>{tool.setup[lang]}</Typography></Box>
      <Box><Typography component="h3" sx={{ color: '#b9ffbd', fontWeight: 800, mb: 1 }}>{en ? 'Compatibility and limits' : '対応環境と制限'}</Typography><Typography sx={{ lineHeight: 1.9 }}>{tool.limits[lang]}</Typography></Box>
    </Box>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 3 }}>
      <Button component="a" href={tool.href} variant="contained" sx={{ bgcolor: '#b9ffbd', color: '#102016', fontWeight: 800, textTransform: 'none', '&:hover': { bgcolor: '#93f99b' } }}>{tool.download ? (en ? 'Download ZIP' : '配布ZIPをダウンロード') : (en ? 'Code and setup' : 'コード・導入手順')}</Button>
      {tool.href !== tool.repo && <Button component="a" href={tool.repo} variant="outlined" sx={{ textTransform: 'none' }}>GitHub</Button>}
    </Box>
    {tool.license[lang] && <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', mt: 2 }}>{tool.license[lang]}</Typography>}
  </Box>)}</>;
}
