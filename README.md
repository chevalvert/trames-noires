# Trames Noires [<img src="https://github.com/chevalvert.png?size=100" size="100" align="right">](http://chevalvert.fr/)

<br>

## Usage

### Hotkeys

- <kbd>space</kbd>: Play/pause
- <kbd>←/→</kbd>: Step 1 frame backward/forward
- <kbd>shift + ←/→</kbd>: Step 1 frame backward/forward
- <kbd>cmd + z</kbd>: Undo last line
- <kbd>cmd + x</kbd>: Clear all
- <kbd>w</kbd>: Toggle wireframe
- <kbd>tab</kbd>: Toggle UI

### Pro mode

For advanced usage, activate pro mode by appending `?pro` to the interface.

### Render video using CLI

Once this repostiroy cloned and installed:

```bash
# Render trames-noires drawing to video
$ npm run render -- <UID>
$ npm run render -- --help
```

## Development

```bash
# Development
$ npm run start
$ npm run test

# Staging
$ npm run build
$ npm run preview
$ npm run deploy:staging

# Production
$ npm run version
```

## Credits

JSX and state utils heavily based on [**pqml**](https://github.com/pqml)’s work.

## License
[MIT.](https://tldrlegal.com/license/mit-license)




