; requires AHK v2 32-bit
#Warn
SetWorkingDir A_ScriptDir "\..\.."
FileEncoding "UTF-8"

common_words1 := "
(Join| C
and|be|if|in|is|of|the|to ;>300
command|example|parameters|related|remarks|which
an|are|as|by|can|for|it|not|on|or|that|this|use|used|will|with ;>200
above|because|blank|contains|current|default|errorlevel|examples|file|first|following|function|hotkey|however|information|instead|line|might|msgbox|new|number|omitted|other|otherwise|parameter|return|script|set|should|single|specified|string|there|unless|using|value|variable|window|windows
all|also|any|at|been|but|case|do|does|each|from|has|have|into|its
may|more|must|name|no|note|off|one|only|same|see
some|such|text|than|time|v1|via|was|when|you ;>100
able|both|due|else|even|how
just|last|like|long|made|make|most|my|need
next|once|out|over|page|part|so|them
then|they|true|two|upon|user|uses|way|word|work|your|zero
)"
; Can't remember how I generated the list above.  I think the list below
; is an edited version of a "common word list" found somewhere on the net.

; The idea is to save space by omitting words from the index if their list of file
; indices would be very long -- if a word appears on every page, there's little
; point indexing it.  This could be improved by keeping words in titles, such as
; the common words in "if var [not] in/contains MatchList".  That way, a search
; full of common words like "if var is type" will pull up the right page (even
; if the page for if-in has more words in it).
common_words := "
(Join|
about|after|again|air|all|along|also|an|and|another|any|are|around|as|at
away|back|be|because|been|before|below|between|both|but|by|came|can|come
could|day|did|different|do|does|don't|down|each|end|even|every|few|find
first|for|found|from|get|give|go|good|great|had|has|have|he|help|her
here|him|his|home|house|how|I|if|in|into|is|it|its|just|know|large|last
left|like|line|little|long|look|made|make|man|many|may|me|men|might|more
most|Mr.|must|my|name|never|new|next|no|not|now|number|of|off|old|on|one
only|or|other|our|out|over|own|part|people|place|put|read|right|said
same|saw|say|see|she|should|show|small|so|some|something|sound|still
such|take|tell|than|that|the|them|then|there|these|they|thing|think|this
those|thought|three|through|time|to|together|too|two|under|up|us|use
very|want|water|way|we|well|went|were|what|when|where|which|while|who
why|will|with|word|work|world|would|write|year|you|your|was
)"

; Here we define the pattern for what to consider a word for indexing.
; It looks like I was experimenting...
; The part that excludes common words is commented out.  Probably because
; it causes odd results with partial searches, such as "if" getting results
; for "IfEqual" etc. but not plain "if", because it isn't indexed.  Omitting
; those words currently only saves about 30KB.
global word_pattern := "#\p{L}{2,}+(?!::)|"
    . "(?<![\p{L}\d_])(?!"
        . "\d+(?![\p{L}\d_])|"
        . "0[xX][0-9a-fA-F]+(?![\p{L}\d_])|"
        . "\d[0-9a-fA-F]+(?![\p{L}\d_])|"
        ; . "(?i)(" common_words ")(?![\p{L}\d_])|"
        . "_+(?![\p{L}\d_]))"
    . "[\p{L}\d_]{2,}(['.][\p{L}\d_]+)?(?![\p{L}\d_])"  ;(-\w+)*
word_pattern := "#\p{L}{2,}+(?!::)|"
    . "(?<![\p{L}\d_])("
        . "\d+|"
        . "0[xX][0-9a-fA-F]+|"
        . "\d[0-9a-fA-F]+|"
        ; . "(?i)(" common_words ")(?![\p{L}\d_])|"
        . "_+|"
        . "https?://\S+"
    . ")(?![\p{L}\d_])(*SKIP)(*FAIL)|"
    . "(?<![\p{L}\d_])\p{Lu}[\p{L}\d_]+\.[\p{L}\d_]+(?![\p{L}\d_])|"
    . "(?<![\p{L}\d_])[\p{L}\d_]{2,}('[\p{L}\d_]+)?(?![\p{L}\d_])"  ;(-\w+)*

global index, files, filewords, files_map, titles_map, titles

ScanFiles()

ScanFiles()
{
    index := Map()
    files := []
    filewords := []
    files_map := Map()
    titles_map := Map()
    titles := Map()
    
    Loop Files, "*.htm", "R"
    {
        if A_LoopFilePath ~= "i)^(scripts\\|settings\.htm)"
        {
            D("skipping " A_LoopFilePath)
            continue
        }
        D(A_LoopFilePath)
        ScanFile(A_LoopFilePath)
    }
    for file_index, words in filewords
        MergeWordsIntoIndex(words, file_index)
    
    s := ""
    
    D("scanning keyword index")
    ScanIndex()
    
    D("sorting titles")
    title_list := ""
    for i, title in titles
        title_list .= title "`n"
    title_list := Sort(SubStr(title_list,1,-1))
    sfiles := []
    stitles := []
    smap := Map()
    Loop Parse, title_list, "`n"
    {
        file_index := titles_map[StrLower(A_LoopField)]
        sfiles.Push(files[file_index])
        stitles.Push(A_LoopField)
        smap[file_index] := A_Index
    }
    
    D("converting to javascript")
    
    s .= "var SearchIndex = {"
    for word, iw in index
    {
        ; Always quote these (though should be okay unquoted in HTML5 browsers, it's no good in CHM viewer even with IE11).
        static js_keywords := "boolean|break|byte|case|catch|char|continue|default|delete|do|double|else|false|final|finally|float|for|function|if|in|instanceof|int|long|new|null|return|short|switch|this|throw|true|try|typeof|var|void|while|with"
            . "|class|const|debugger|enum|export|extends|import|super"  ; These probably only in JScript.
        if word ~= "(?!\b(" js_keywords ")\b)^[\p{Ll}_][\p{L}\d_]*$"
            s .= word ':"'
        else
            s .= '"' word '":"'
        for i, ff in iw
        {
            s .= encode_number(smap[ff[1]]-1, 2)
        }
        s .= '",'
    }
    s := SubStr(s,1,-1) "}`n`n"
    
    abbs := Map(
        "C", "commands/",
        "V", "Variables#",
        "F", "Functions#"
        )
    s .= 'var'
    for a, p in abbs
        s .= Format(' {1}="{2}",', a, p)
    s := SubStr(s, 1, -1)
    s .= '`n'
    
    s .= "var SearchFiles = ["
    for i, f in sfiles
    {
        f := StrReplace(f, ".htm")
        for a, p in abbs
            if InStr(f, p) = 1
            {
                s .= Format('{1}+"{2}",', a, SubStr(f, StrLen(p)+1))
                continue 2
            }
        s .= Format('"{1}",', f)
    }
    s := SubStr(s,1,-1) "]`n`n"
    
    s .= "var SearchTitles = ["
    for i, t in stitles
        s .= Format('"{1}",', t)
    s := SubStr(s,1,-1) "]`n`n"
    
    s .= "
    (
    if (window.onReceiveSearchIndex)
        $(window.onReceiveSearchIndex); // $() for local IE8.
    )"
    
    FileDelete "static\source\data_search.js"
    FileAppend s, "static\source\data_search.js"
}

ScanFile(filename)
{
    html := FileRead(filename)
    
    ; Index only content, not markup
    doc := ComObjCreate("htmlfile")
    doc.write(StrReplace(html, "<", " <"))  ; Can't remember the reason for StrReplace(). Maybe to preserve word boundaries.
    doc.close()
    Loop {
        try {
            text := doc.body.innerText
            if text != ""
                break
        }
        if A_Index > 10 {
            D("can't parse file " filename)
            return
        }
        sleep 10
    }
    
    if doc.title = "" {
        D("skipping file with no title: " filename)
        return
    }
    
    href := StrReplace(filename, "\", "/")
    files.Push(href)
    filewords.Push(words := Map())
    file_index := files.Length
    files_map[href] := file_index

    h1 := ""
    try h1 := doc.getElementsByTagName("h1")[0] ; Use h1 instead of doc.title to avoid suffixes such as "| AutoHotkey".
    if not h1 {
        D("skipping file with no h1: " filename)
        return
    }
    h1.innerHTML := RegExReplace(h1.innerHTML, '<span.*?</span>') ; Remove heading notes or version annotations.
    h1 := Trim(h1.innerText)
    titles[file_index] := h1
    if titles_map.Has(h1_ := StrLower(h1))
        throw Exception("Duplicate title: " h1 "`n  " files[file_index] "`n  " files[titles_map[h1_]])
    titles_map[h1_] := file_index
    
    SplitPath filename, name
    FileDelete "test\" name
    FileAppend text, "test\" name
    
    ScanText(text, words)
    
    ; Put lots of extra weight on words in headings, depending on the h-level
    Loop 4
    {
        el := doc.getElementsByTagName("h" A_Index)
        text := ""
        Loop el.length
            text .= el.item(A_Index-1).innerText "`n"
        if text != ""
            ScanText(text, words, 100*(5-A_Index))
    }
    
    ; Put a little more weight on words in Syntax blocks
    el := doc.getElementsByTagName("pre")
    text := ""
    Loop el.length
    {
        e := el.item(A_Index-1)
        if e.className != "Syntax"
            continue
        text .= e.innerText "`n"
    }
    if text != ""
        ScanText(text, words, 5)
    
    ; Put some extra weight on words which are used in links pointing to
    ; a page (i.e. add weight to the target page, not this one).
    e := doc.getElementsByTagName("a")
    Loop e.length
    {
        a := e.item(A_Index-1)
        a_href := RegExReplace(a.getAttribute("href", 2), "#.*")
        if InStr(a_href, "://") || a_href = ""
            continue
        a_href := RegExReplace(href "/../" a_href, "(^|/)[^/]+(?0)?/\.\.(?=/)", "")
        if files_map.Has(a_href)
            ScanText(a.innerText, filewords[files_map[a_href]], 10)
    }
}

ScanText(text, words, weight := 1)
{
    p := 1
    While p := RegExMatch(text, word_pattern, m, p)
    {
        m := StrLower(m.0)
        words[m] := (words.Has(m) ? words[m] : 0) + weight
        p += StrLen(m)
    }
}

MergeWordsIntoIndex(words, file_index)
{
    for word, freq in words  ; freq = frequency
    {
        if !index.Has(word)
        {
            ; Add word to index
            index[word] := [[file_index, freq]]
            continue
        }
        iw := index[word]
        for iww in iw
            if iww[1] = file_index
            {
                ; File already indexed -- increase frequency
                ; FIXME: file list should probably be re-sorted later?
                iww[2] += freq
                return
            }
        ; Add new file to this word -- files are ordered according to word frequency
        insert_at := 1
        while insert_at <= iw.Length && freq <= iw[insert_at][2]
            insert_at++
        iw.InsertAt(insert_at, [file_index, freq])
    }
}

ScanIndex()
{
    if A_PtrSize != 4
    {
        D("skipping index; need 32-bit to eval data_index.js")
        return
    }
    sc := ComObjCreate("ScriptControl"), sc.Language := "JScript"
    sc.AddCode(FileRead("static\source\data_index.js"))
    ji := sc.Eval("indexData")
    if !(ji && ji.length)
        throw Exception("Failed to read/parse data_index.js")
    
    Loop ji.length
    {
        title := ji.%A_Index-1%.0
        path  := ji.%A_Index-1%.1
        
        ; Scan the words in this topic title
        words := Map()
        ScanText(title, words, 400)
        
        ; Add this topic file (if needed)
        if titles_map.Has(title_ := StrLower(title))
            file_index := titles_map[title_]
        else
        {
            files.Push(path)
            filewords.Push(Map())
            titles_map[title_] := file_index := files.Length
            titles[file_index] := title
        }
        
        ; Merge words into main search index
        MergeWordsIntoIndex(words, file_index)
    }
}

; Encode a number in a custom compact format utilizing upper- and lower-case letters
encode_number(n, length := "")
{
    a := ""
    while n != 0
    {
        i := Mod(n,52)
        if i < 26
            a := Chr(Ord("a") + i) . a
        else
            a := Chr(Ord("A") + i - 26) . a
        n //= 52
    }
    if length
    {
        if StrLen(a) > length
            throw Exception("Number too long",, n " => " a)
        Loop length - StrLen(a)
            a := "a" a
    }
    return a
}



D(s) {  ; debug output.
    FileAppend s "`n", "*"
}
