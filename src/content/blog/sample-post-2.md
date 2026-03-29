---
title: "TypeScript の型ユーティリティ一覧"
date: 2024-12-15
category: "その他技術"
tags: ["TypeScript", "型", "ユーティリティ"]
excerpt: "Partial, Pick, Omit など、TypeScript の組み込み型ユーティリティの使い方。"
draft: false
---

## はじめに

TypeScript には、既存の型を変換するための便利な組み込みユーティリティ型が用意されています。

## よく使うユーティリティ型

### Partial\<T\>

全てのプロパティをオプショナルにします。

```typescript
interface User {
  name: string;
  age: number;
  email: string;
}

type PartialUser = Partial<User>;
// { name?: string; age?: number; email?: string; }
```

### Pick\<T, K\>

指定したプロパティだけを抽出します。

```typescript
type UserName = Pick<User, 'name' | 'email'>;
// { name: string; email: string; }
```

### Omit\<T, K\>

指定したプロパティを除外します。

```typescript
type UserWithoutEmail = Omit<User, 'email'>;
// { name: string; age: number; }
```

### Record\<K, T\>

キーと値の型を指定してオブジェクト型を作成します。

```typescript
type PageInfo = Record<string, { title: string; url: string }>;
```

### Readonly\<T\>

全てのプロパティを読み取り専用にします。

```typescript
type ReadonlyUser = Readonly<User>;
```

## まとめ

| ユーティリティ | 用途 |
|--------------|------|
| `Partial<T>` | 全プロパティをオプショナルに |
| `Pick<T, K>` | 指定プロパティを抽出 |
| `Omit<T, K>` | 指定プロパティを除外 |
| `Record<K, T>` | キー・値の型でオブジェクト作成 |
| `Readonly<T>` | 全プロパティを読み取り専用に |

これらを活用して、型安全なコードを書きましょう。
