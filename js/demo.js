$(function() {
  $('#chart').css('height', $(window).height());

  $("#popup").draggable();
  $(".tabs-menu a").click(function(event) {
      event.preventDefault();
      $(this).parent().addClass("current");
      $(this).parent().siblings().removeClass("current");
      var tab = $(this).attr("href");
      $(".tab-content").not(tab).css("display", "none");
      $(tab).fadeIn();
  });

  var left = $(window).width() / 2 - $('#popup').width() / 2;
  var top = $(window).height() / 2 - $('#popup').height() / 2;
  $('#popup').css('left', left);
  $('#popup').css('top', top);

  $('.close-popup').click(function(){
    $('#popup').hide();
  });

  Highcharts.createElement('link', {
    href: 'https://fonts.googleapis.com/css?family=Unica+One',
    rel: 'stylesheet',
    type: 'text/css'
  }, null, document.getElementsByTagName('head')[0]);

  Highcharts.theme = {
    colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
      '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
    chart: {
      backgroundColor: {
        linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
        stops: [
          [0, '#2a2a2b'],
          [1, '#3e3e40']
        ]
      },
      style: {
        fontFamily: '\'Unica One\', sans-serif'
      },
      plotBorderColor: '#606063'
    },
    title: {
      style: {
        color: '#E0E0E3',
        textTransform: 'uppercase',
        fontSize: '20px'
      }
    },
    subtitle: {
      style: {
        color: '#E0E0E3',
        textTransform: 'uppercase'
      }
    },
    xAxis: {
      gridLineColor: '#707073',
      labels: {
        style: {
          color: '#E0E0E3'
        }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      title: {
        style: {
          color: '#A0A0A3'

        }
      }
    },
    yAxis: {
      gridLineColor: '#707073',
      labels: {
        style: {
          color: '#E0E0E3'
        }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      tickWidth: 1,
      title: {
        style: {
          color: '#A0A0A3'
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      style: {
        color: '#F0F0F0'
      }
    },
    plotOptions: {
      series: {
        dataLabels: {
          color: '#B0B0B3'
        },
        marker: {
          lineColor: '#333'
        }
      },
      boxplot: {
        fillColor: '#505053'
      },
      candlestick: {
        lineColor: 'white'
      },
      errorbar: {
        color: 'white'
      }
    },
    legend: {
      itemStyle: {
        color: '#E0E0E3'
      },
      itemHoverStyle: {
        color: '#FFF'
      },
      itemHiddenStyle: {
        color: '#606063'
      }
    },
    credits: {
      style: {
        color: '#666'
      }
    },
    labels: {
      style: {
        color: '#707073'
      }
    },

    drilldown: {
      activeAxisLabelStyle: {
        color: '#F0F0F3'
      },
      activeDataLabelStyle: {
        color: '#F0F0F3'
      }
    },

    navigation: {
      buttonOptions: {
        symbolStroke: '#DDDDDD',
        theme: {
          fill: '#505053'
        }
      }
    },

    // scroll charts
    rangeSelector: {
      buttonTheme: {
        fill: '#505053',
        stroke: '#000000',
        style: {
          color: '#CCC'
        },
        states: {
          hover: {
            fill: '#707073',
            stroke: '#000000',
            style: {
              color: 'white'
            }
          },
          select: {
            fill: '#000003',
            stroke: '#000000',
            style: {
              color: 'white'
            }
          }
        }
      },
      inputBoxBorderColor: '#505053',
      inputStyle: {
        backgroundColor: '#333',
        color: 'silver'
      },
      labelStyle: {
        color: 'silver'
      }
    },

    navigator: {
      handles: {
        backgroundColor: '#666',
        borderColor: '#AAA'
      },
      outlineColor: '#CCC',
      maskFill: 'rgba(255,255,255,0.1)',
      series: {
        color: '#7798BF',
        lineColor: '#A6C7ED'
      },
      xAxis: {
        gridLineColor: '#505053'
      }
    },

    scrollbar: {
      barBackgroundColor: '#808083',
      barBorderColor: '#808083',
      buttonArrowColor: '#CCC',
      buttonBackgroundColor: '#606063',
      buttonBorderColor: '#606063',
      rifleColor: '#FFF',
      trackBackgroundColor: '#404043',
      trackBorderColor: '#404043'
    },

    // special colors for some of the
    legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
    background2: '#505053',
    dataLabelsColor: '#B0B0B3',
    textColor: '#C0C0C0',
    contrastTextColor: '#F0F0F3',
    maskColor: 'rgba(255,255,255,0.3)'
  };

  // Apply the theme
  Highcharts.setOptions(Highcharts.theme);

  var selectTime = $('#select-time').val();

  $.getJSON('https://api.cryptowat.ch/markets/bitflyer/btcfxjpy/ohlc?periods=' + selectTime, function (full_data) {

    // split the data set into ohlc and volume
    var data = full_data["result"][selectTime];

    var ohlc = [],
      volume = [],
      dataLength = data.length,
      // set the allowed units for data grouping
      groupingUnits = [[
        'week',                         // unit name
        [1]                             // allowed multiples
      ], [
        'minute',
        [1, 2, 3, 4, 6]
      ]],

      i = 0;

    for (i; i < dataLength; i += 1) {
      ohlc.push([
        data[i][0], // the date
        data[i][1], // open
        data[i][2], // high
        data[i][3], // low
        data[i][4] // close
      ]);

      volume.push([
        data[i][0], // the date
        data[i][5] // the volume
      ]);
    }

    var lastTime = ohlc[ohlc.length - 1][0];

    // create the chart
    stockChart = new Highcharts.stockChart('chart', {

      rangeSelector: {
        selected: 2
      },

      title: {
        text: 'Bitcoin Historical Demo'
      },

      subtitle: {
        text: 'With SMA and Volume by Price technical indicators'
      },

      yAxis: [{
        startOnTick: false,
        endOnTick: false,
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'OHLC'
        },
        height: '60%',
        lineWidth: 2,
        resize: {
          enabled: true
        }
      }, {
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'Volume'
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
      }],

      tooltip: {
        split: true
      },

      plotOptions: {
        series: {
          cursor: 'pointer',
          dataGrouping: {
            units: groupingUnits
          },
          point: {
            events: {
              click: function() {
                $('#popup').show();
                $('.tab-content').hide();
                $('.tabs-menu li').removeClass('current');
                if (this.series.userOptions.type === 'sma') {
                  $('#tab-1').show();
                  $('a[href^="#tab-1"]').parent().addClass('current');
                  $('.sma-value').val(this.y);
                } else if (this.series.userOptions.type === 'candlestick') {
                  $('#tab-2').show();
                  $('a[href^="#tab-2"]').parent().addClass('current');
                  $('.candlestick-current').val(this.y);
                  $('.candlestick-open').val(this.open);
                  $('.candlestick-high').val(this.high);
                  $('.candlestick-low').val(this.low);
                  $('.candlestick-close').val(this.close);
                }
              }
            }
          }
        }
      },

      series: [{
        type: 'candlestick',
        name: 'BTCFX',
        id: 'aapl',
        zIndex: 2,
        data: ohlc
      }, {
        type: 'column',
        name: 'Volume',
        id: 'volume',
        data: volume,
        yAxis: 1
      }, {
        type: 'sma',
        linkedTo: 'aapl',
        zIndex: 1,
        marker: {
          enabled: false
        }
      }]
    });

    // change select time
    $('#select-time').change(function () {
      selectTime = $('#select-time').val();
      $.getJSON('https://api.cryptowat.ch/markets/bitflyer/btcfxjpy/ohlc?periods=' + selectTime, function (full_data) {
        // split the data set into ohlc and volume
        var newData = full_data["result"][selectTime];

        ohlc = [];
        volume = [];
        var i = 0;

        for (i; i < newData.length; i += 1) {
          ohlc.push([
            newData[i][0], // the date
            newData[i][1], // open
            newData[i][2], // high
            newData[i][3], // low
            newData[i][4] // close
          ]);

          volume.push([
            newData[i][0], // the date
            newData[i][5] // the volume
          ]);
        }

        lastTime = ohlc[ohlc.length - 1][0];

        stockChart.series[0].setData(ohlc, true);
        stockChart.series[1].setData(volume, true);
        stockChart.redraw();

      });
    });

    window.setInterval(function(){
      var url = 'https://api.cryptowat.ch/markets/bitflyer/btcfxjpy/ohlc?periods=' + selectTime + '&after=' + lastTime;
      $.getJSON(url, function (full_data) {
        var lastData = full_data["result"][selectTime];
        lastDataLength = lastData.length;
        console.log(lastDataLength);
        if (lastDataLength === 1) {
          // update last item
          ohlc[ohlc.length - 1] = [
            lastData[0][0], // the date
            lastData[0][1], // open
            lastData[0][2], // high
            lastData[0][3], // low
            lastData[0][4] // close
          ];

          volume[volume.length - 1] = [
            lastData[0][0], // the date
            lastData[0][5] // the volume
          ];
        } else if (lastDataLength > 1) {
          lastTime = lastData[lastDataLength - 1][0];

          // update last item
          ohlc[ohlc.length - 1] = [
            lastData[lastDataLength - 2][0], // the date
            lastData[lastDataLength - 2][1], // open
            lastData[lastDataLength - 2][2], // high
            lastData[lastDataLength - 2][3], // low
            lastData[lastDataLength - 2][4] // close
          ];

          volume[volume.length - 1] = [
            lastData[lastDataLength - 2][0], // the date
            lastData[lastDataLength - 2][5] // the volume
          ];

          // push new item to last
          ohlc.push([
            lastData[lastDataLength - 1][0], // the date
            lastData[lastDataLength - 1][1], // open
            lastData[lastDataLength - 1][2], // high
            lastData[lastDataLength - 1][3], // low
            lastData[lastDataLength - 1][4] // close
          ]);

          volume.push([
            lastData[lastDataLength - 1][0], // the date
            lastData[lastDataLength - 1][5] // the volume
          ]);
        }

        stockChart.series[0].setData(ohlc, true);
        stockChart.series[1].setData(volume, true);
        stockChart.redraw();
      });
    }, 10000);
  });
});