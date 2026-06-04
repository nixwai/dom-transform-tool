import process from 'node:process';

const BAR_WIDTH = 24;

type ProgressStatus = 'running' | 'done' | 'failed';

/** Simple ASCII progress bar. Refreshes in-place for TTY output and logs by line otherwise. */
export class ProgressBar {
  title: string;
  total: number;
  completed = 0;
  lastLine = '';

  constructor(title: string, total: number) {
    this.title = title;
    this.total = total;
  }

  step(label: string) {
    this.render('running', label);
  }

  complete(label: string) {
    this.completed += 1;
    this.render('running', label);
  }

  finish(label: string) {
    this.completed = this.total;
    this.render('done', label);
  }

  fail(label: string) {
    this.render('failed', label);
  }

  private render(status: ProgressStatus, label: string) {
    const line = formatProgressLine(this.title, this.completed, this.total, status, label);

    if (!process.stdout.isTTY) {
      if (line !== this.lastLine) {
        process.stdout.write(`${line}\n`);
      }
      this.lastLine = line;
      return;
    }

    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(line);

    if (status !== 'running') {
      process.stdout.write('\n');
    }

    this.lastLine = line;
  }
}

function formatProgressLine(
  title: string,
  completed: number,
  total: number,
  status: ProgressStatus,
  label: string,
) {
  const percent = total === 0 ? 100 : Math.round((completed / total) * 100);
  const filled = Math.round((percent / 100) * BAR_WIDTH);
  const bar = `${'#'.repeat(filled)}${'-'.repeat(BAR_WIDTH - filled)}`;
  const state = status === 'running' ? `${completed}/${total}` : status;

  return `[${bar}] ${String(percent).padStart(3)}% ${title} ${state} - ${label}`;
}
