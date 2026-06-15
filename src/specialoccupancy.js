
const monthTexts = [
    "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"
]

export function specialoccupancies({ attributes, setAttributes }) {

    const months = [];
    var monthrows = [];
    var text = attributes.specialoccupancies;
    if (!text) {
        text = "";
    }
    var lines = text.split("\n")
    const notProcessedLines = [];
    var currentMonth = "";
    var currentYear = "";
    for (var line of lines) {
        var match = line.match(/(?<date>[^\t]+ (?<d>\d{1,2})\.(?<m>\d{1,2})\.((?<y>\d{4})))?\t+((?<start>\d+[.:]\d+) *– *(?<end>\d+[.:]\d+) *Uhr)\t+(?<rooms>[^\t]+)\t(?<desc>[^\t]+)/);
        if (match) {
            var month = match.groups.m;
            var year = match.groups.y
            if (match.groups.date && (currentMonth !== month || currentYear !== year)) {
                addMonth(months, monthrows, currentMonth, currentYear);
                currentMonth = month;
                currentYear = year;
                monthrows = [];
            }
            monthrows.push(<tr key={line}>
                <td>{match.groups.date}</td>
                <td>{match.groups.start} - {match.groups.end} Uhr</td>
                <td>{match.groups.rooms}</td>
                <td>{match.groups.desc}</td>
            </tr>);
        } else if (!line.match(/^\s*$/)) {
            notProcessedLines.push(<p style={{ backgroundColor: "#f88" }}>{line}</p>)
        }
    }
    addMonth(months, monthrows, currentMonth, currentYear);
    return (
        <>
            {setAttributes || months.length > 0 ? <>
                <hr class="wp-block-separator has-alpha-channel-opacity" />
                <h2 class="wp-block-heading">Aktueller Sonderbelegungsplan</h2>
            </> : ""}
            {setAttributes ? <>
                <p>(Sonderbelegungsplan wird nur angezeigt, wenn auch Inhalt vorhanden ist)</p>
                <p>Inhalt aus dem Word Dokument einfach hier rein kopieren:</p>
                <textarea
                    rows="20" cols="100"
                    value={attributes.specialoccupancies}
                    onChange={e => setAttributes({ specialoccupancies: e.target.value })}
                />
                {notProcessedLines.length > 0 ? <>
                    <h3>Folgende Zeilen konnten nicht verarbeitet werden:</h3>
                    <div>
                        {notProcessedLines}
                    </div>
                </> : ""}
            </> : ""}
            {months}
        </>
    );
}

function addMonth(months, monthrows, month, year) {
    if (monthrows && monthrows.length > 0) {
        var monthText = monthTexts[parseInt(month) - 1];
        months.push(
            <>
                <h3 class="wp-block-heading">Sonderbelegungen {monthText} {year}</h3>
                <figure class="wp-block-table is-style-stripes">
                    <table>
                        <thead>
                            <tr>
                                <th>Datum</th>
                                <th>Uhrzeit</th>
                                <th>Saal</th>
                                <th>Beschreibung</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monthrows}
                        </tbody>
                    </table>
                </figure>
            </>)
    }
}

