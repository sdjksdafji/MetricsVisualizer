function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    f = files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
      var text = reader.result;
      metrics = JSON.parse(text);
      plot(metrics)
    }

    reader.readAsText(f);
}


$(document).ready(function() {
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
});

function plot(metrics){
    if(metrics.area_under_roc){
        aucLabel.innerText ="AUC: " + metrics.area_under_roc;
    }

    if(metrics.area_under_pr){
        auprLabel.innerText = "AUPR: " + metrics.area_under_pr;
    }
    metrics.threshold_precision.unshift(["threshold_precision", "Precision"]);
    metrics.threshold_recall.unshift(["threshold_recall", "Recall"]);
    metrics.threshold_f1_score.unshift(["threshold_f1_score", "F1 Score"]);

    var precisionCol = transposeArray(metrics.threshold_precision, 2);
    var recallCol = transposeArray(metrics.threshold_recall, 2);
    var f1Col = transposeArray(metrics.threshold_f1_score, 2);
    var chart = c3.generate({
        bindto: '#chart',
        data: {
            xs: {
                'Precision': 'threshold_precision',
                'Recall': 'threshold_recall',
                'F1 Score': 'threshold_f1_score',
            },
            columns: [
                precisionCol[0],
                recallCol[0],
                f1Col[0],
                precisionCol[1],
                recallCol[1],
                f1Col[1],
            ]
        },
        axis: {
            x: {
                tick: {
                    count: 20,
                    format: d3.format('.2f'),
                },
                label: {
                    text: "Threshold",
                    position: 'outer-right',
                },
            },
            y: {
                label: {
                    text: "P, R, F1",
                    position: 'outer-top',
                },
            },
        },
    });

    metrics.roc_false_pos_true_pos.unshift(["False Positives", "True Positives"]);
    var rocCol = transposeArray(metrics.roc_false_pos_true_pos, 2);

    var chart = c3.generate({
        bindto: '#rocChart',
        data: {
            xs: {
                'True Positives': 'False Positives',
            },
            columns: [
                rocCol[0],
                rocCol[1],
            ]
        },
        axis: {
            x: {
                tick: {
                    count: 20,
                    format: d3.format('.2f'),
                },
                label: {
                    text: "False Positives",
                    position: 'outer-right',
                },
            },
            y: {
                label: {
                    text: "True Positives",
                    position: 'outer-top',
                },
            },
        },
    });

    metrics.pr_recall_precision.unshift(["Recall", "Precision"]);
    var prCol = transposeArray(metrics.pr_recall_precision, 2);

    var chart = c3.generate({
        bindto: '#prChart',
        data: {
            xs: {
                'Precision': 'Recall',
            },
            columns: [
                prCol[0],
                prCol[1],
            ],
        },
        axis: {
            x: {
                tick: {
                    count: 20,
                    format: d3.format('.2f'),
                },
                label: {
                    text: "Recall",
                    position: 'outer-right',
                },
            },
            y: {
                label: {
                    text: "Precision",
                    position: 'outer-top',
                },
            },
        },
    });
}

function transposeArray(array, arrayLength){

    var newArray = [];
    for(var i = 0; i < arrayLength; i++){
        newArray.push([]);
    };

    for(var i = 0; i < array.length; i++){
        for(var j = 0; j < arrayLength; j++){
            newArray[j].push(array[i][j]);
        };
    };

    return(newArray);
}