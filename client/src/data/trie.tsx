export class TrieNode {
    children: any;
    isEndOfWord: boolean;

    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

export class Trie {
    root: TrieNode;

    constructor() {
        this.root = new TrieNode();
    }

    insert(word:string) {
        let cur = this.root;
        for(let i = 0; i < word.length; i++) {
            if(!cur.children.hasOwnProperty(word.charAt(i))) {
                cur.children[word.charAt(i)] = new TrieNode();
            }
            cur = cur.children[word.charAt(i)];
        }
        cur.isEndOfWord = true;
    }

    findWordsStartingWith(prefix:string) : string[] {
        // move to the right node and append unique whole words to result
        let cur = this.root;
        let result:string[] = [];

        for(let i = 0; i < prefix.length; i++) {
            if(!cur.children.hasOwnProperty(prefix.charAt(i))) {
                return result;
            }
            cur = cur.children[prefix.charAt(i)];
        }
        // depth first traversal
        function dfs(node:TrieNode, results:string[], pref:string, suff:string):void {
            const keys = Object.keys(node.children);
            if(keys.length === 0 || node.isEndOfWord){
                results.push(pref+suff);
            }

            Array.from(keys).forEach((c) => {
                dfs(node.children[c], results, pref, suff+c);
            })
        }

        dfs(cur, result, prefix, "");
        return result;
    }
}