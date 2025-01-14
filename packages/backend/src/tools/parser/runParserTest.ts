import { ChallengeParser } from "../../parser/ChallengeParsers";
import { getTSParserByLanguage } from "../../parser/getTSParserByLanguage";

const language = "go";

const base64Content =
  "Ly8gQ29weXJpZ2h0IDIwMTYgVGhlIGV0Y2QgQXV0aG9ycwovLwovLyBMaWNl\nbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0\naGUgIkxpY2Vuc2UiKTsKLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBl\neGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLgovLyBZb3Ug\nbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXQKLy8KLy8gICAg\nIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMAov\nLwovLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdy\nZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlCi8vIGRpc3RyaWJ1dGVkIHVu\nZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuICJBUyBJUyIg\nQkFTSVMsCi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9G\nIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLgovLyBTZWUg\ndGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5p\nbmcgcGVybWlzc2lvbnMgYW5kCi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBM\naWNlbnNlLgoKcGFja2FnZSBncnBjcHJveHkKCmltcG9ydCAoCgkiY29udGV4\ndCIKCSJpbyIKCglwYiAiZ28uZXRjZC5pby9ldGNkL2FwaS92My9ldGNkc2Vy\ndmVycGIiCgljbGllbnR2MyAiZ28uZXRjZC5pby9ldGNkL2NsaWVudC92MyIK\nKQoKdHlwZSBtYWludGVuYW5jZVByb3h5IHN0cnVjdCB7CgltYWludGVuYW5j\nZUNsaWVudCBwYi5NYWludGVuYW5jZUNsaWVudAp9CgpmdW5jIE5ld01haW50\nZW5hbmNlUHJveHkoYyAqY2xpZW50djMuQ2xpZW50KSBwYi5NYWludGVuYW5j\nZVNlcnZlciB7CglyZXR1cm4gJm1haW50ZW5hbmNlUHJveHl7CgkJbWFpbnRl\nbmFuY2VDbGllbnQ6IHBiLk5ld01haW50ZW5hbmNlQ2xpZW50KGMuQWN0aXZl\nQ29ubmVjdGlvbigpKSwKCX0KfQoKZnVuYyAobXAgKm1haW50ZW5hbmNlUHJv\neHkpIERlZnJhZ21lbnQoY3R4IGNvbnRleHQuQ29udGV4dCwgZHIgKnBiLkRl\nZnJhZ21lbnRSZXF1ZXN0KSAoKnBiLkRlZnJhZ21lbnRSZXNwb25zZSwgZXJy\nb3IpIHsKCXJldHVybiBtcC5tYWludGVuYW5jZUNsaWVudC5EZWZyYWdtZW50\nKGN0eCwgZHIpCn0KCmZ1bmMgKG1wICptYWludGVuYW5jZVByb3h5KSBTbmFw\nc2hvdChzciAqcGIuU25hcHNob3RSZXF1ZXN0LCBzdHJlYW0gcGIuTWFpbnRl\nbmFuY2VfU25hcHNob3RTZXJ2ZXIpIGVycm9yIHsKCWN0eCwgY2FuY2VsIDo9\nIGNvbnRleHQuV2l0aENhbmNlbChzdHJlYW0uQ29udGV4dCgpKQoJZGVmZXIg\nY2FuY2VsKCkKCgljdHggPSB3aXRoQ2xpZW50QXV0aFRva2VuKGN0eCwgc3Ry\nZWFtLkNvbnRleHQoKSkKCglzYywgZXJyIDo9IG1wLm1haW50ZW5hbmNlQ2xp\nZW50LlNuYXBzaG90KGN0eCwgc3IpCglpZiBlcnIgIT0gbmlsIHsKCQlyZXR1\ncm4gZXJyCgl9CgoJZm9yIHsKCQlyciwgZXJyIDo9IHNjLlJlY3YoKQoJCWlm\nIGVyciAhPSBuaWwgewoJCQlpZiBlcnIgPT0gaW8uRU9GIHsKCQkJCXJldHVy\nbiBuaWwKCQkJfQoJCQlyZXR1cm4gZXJyCgkJfQoJCWVyciA9IHN0cmVhbS5T\nZW5kKHJyKQoJCWlmIGVyciAhPSBuaWwgewoJCQlyZXR1cm4gZXJyCgkJfQoJ\nfQp9CgpmdW5jIChtcCAqbWFpbnRlbmFuY2VQcm94eSkgSGFzaChjdHggY29u\ndGV4dC5Db250ZXh0LCByICpwYi5IYXNoUmVxdWVzdCkgKCpwYi5IYXNoUmVz\ncG9uc2UsIGVycm9yKSB7CglyZXR1cm4gbXAubWFpbnRlbmFuY2VDbGllbnQu\nSGFzaChjdHgsIHIpCn0KCmZ1bmMgKG1wICptYWludGVuYW5jZVByb3h5KSBI\nYXNoS1YoY3R4IGNvbnRleHQuQ29udGV4dCwgciAqcGIuSGFzaEtWUmVxdWVz\ndCkgKCpwYi5IYXNoS1ZSZXNwb25zZSwgZXJyb3IpIHsKCXJldHVybiBtcC5t\nYWludGVuYW5jZUNsaWVudC5IYXNoS1YoY3R4LCByKQp9CgpmdW5jIChtcCAq\nbWFpbnRlbmFuY2VQcm94eSkgQWxhcm0oY3R4IGNvbnRleHQuQ29udGV4dCwg\nciAqcGIuQWxhcm1SZXF1ZXN0KSAoKnBiLkFsYXJtUmVzcG9uc2UsIGVycm9y\nKSB7CglyZXR1cm4gbXAubWFpbnRlbmFuY2VDbGllbnQuQWxhcm0oY3R4LCBy\nKQp9CgpmdW5jIChtcCAqbWFpbnRlbmFuY2VQcm94eSkgU3RhdHVzKGN0eCBj\nb250ZXh0LkNvbnRleHQsIHIgKnBiLlN0YXR1c1JlcXVlc3QpICgqcGIuU3Rh\ndHVzUmVzcG9uc2UsIGVycm9yKSB7CglyZXR1cm4gbXAubWFpbnRlbmFuY2VD\nbGllbnQuU3RhdHVzKGN0eCwgcikKfQoKZnVuYyAobXAgKm1haW50ZW5hbmNl\nUHJveHkpIE1vdmVMZWFkZXIoY3R4IGNvbnRleHQuQ29udGV4dCwgciAqcGIu\nTW92ZUxlYWRlclJlcXVlc3QpICgqcGIuTW92ZUxlYWRlclJlc3BvbnNlLCBl\ncnJvcikgewoJcmV0dXJuIG1wLm1haW50ZW5hbmNlQ2xpZW50Lk1vdmVMZWFk\nZXIoY3R4LCByKQp9CgpmdW5jIChtcCAqbWFpbnRlbmFuY2VQcm94eSkgRG93\nbmdyYWRlKGN0eCBjb250ZXh0LkNvbnRleHQsIHIgKnBiLkRvd25ncmFkZVJl\ncXVlc3QpICgqcGIuRG93bmdyYWRlUmVzcG9uc2UsIGVycm9yKSB7CglyZXR1\ncm4gbXAubWFpbnRlbmFuY2VDbGllbnQuRG93bmdyYWRlKGN0eCwgcikKfQo=\n";

function parserTest() {
  const TS = getTSParserByLanguage(language);
  const parser = new ChallengeParser(TS);
  const content = Buffer.from(base64Content, "base64").toString();
  console.log(parser.parseTrackedNodes(content));
}

async function runSyncTrackedRepos() {
  parserTest();
  process.exit(0);
}

runSyncTrackedRepos();
