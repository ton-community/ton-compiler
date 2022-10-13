export function cutFirstLine(src: string) {
    return src.slice(src.indexOf('\n') + 1);
}