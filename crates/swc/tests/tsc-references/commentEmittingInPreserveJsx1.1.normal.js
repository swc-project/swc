//// [file.tsx]
<div>
    // Not Comment
</div>;
<div>
    // Not Comment
    {}
    // Another not Comment
</div>;
<div>
    // Not Comment
    {//Comment just Fine
"Hi"}
    // Another not Comment
</div>;
<div>
    /* Not Comment */
    {//Comment just Fine
"Hi"}
</div>;
