export default {
  branches: ["main"],
  plugins: [
    "@semantic-release/commit-analyzer",   // 커밋 메시지 분석
    "@semantic-release/release-notes-generator", // 릴리스 노트 생성
    ["@semantic-release/changelog", {
      changelogFile: "CHANGELOG.md"
    }],
    ["@semantic-release/git", {
      assets: ["CHANGELOG.md", "package.json"]
    }],
    ["@semantic-release/github", {
      assets: []
    }]
  ]
}