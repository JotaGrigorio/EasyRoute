(function ($) {
    $.fn.extend({
        smartpaginator: function (options) {

            var settings = $.extend({
                totalrecords: 0,
                recordsperpage: 0,
                length: 10,
                next: 'Next',
                prev: 'Prev',
                first: 'First',
                last: 'Last',
                go: 'Go',
                display: 'double',
                initval: 1,
                datacontainer: '',
                dataelement: '', 
                onchange: null,
                controlsalways: false
            }, options);
            return this.each(function () {
                var currentPage = 0;
                var startPage = 0;
                var totalpages = parseInt(settings.totalrecords / settings.recordsperpage);
                if (settings.totalrecords % settings.recordsperpage > 0) totalpages++;
                var initialized = false;
                var container = $(this);
                container.find('ul').remove();
                container.find('div').remove();
                container.find('span').remove();
                var dataContainer;
                var dataElements;
                if (settings.datacontainer != '') {
                    dataContainer = $('#' + settings.datacontainer);
                    dataElements = $('' + settings.dataelement + '', dataContainer);
                }
                var list = $('<ul/>').addClass('pagination');
                
                container.append(list).addClass('centro');
                
                buildNavigation(startPage);
                if (settings.initval == 0) settings.initval = 1;
                currentPage = settings.initval - 1;
                navigate(currentPage);
                initialized = true;
                
                function buildNavigation(startPage) {

                    list.find('li').remove();

                    if (settings.totalrecords <= settings.recordsperpage) return;

                    montaLi('fa-fast-backward', 0, 'Primeira página');

                    for (var i = startPage; i < startPage + settings.length; i++) {
                        if (i == totalpages) break;

                        var textNum = (i + 1).toString();
                        if (textNum.length == 1) textNum = '0' + textNum;

                        list.append($('<li/>').attr('id', (i + 1)).addClass('page-item').append($('<a>').addClass('page-link').attr('href', 'javascript:void(0)').text(textNum))
                                    .click(function () {
                                        currentPage = startPage + $(this).closest('li').prevAll().length - 1;
                                        navigate(currentPage);
                                    }));

                    }

                    montaLi('fa-fast-forward', totalpages - 1, 'Última página');
                    
                    list.find('li').removeClass('active');
                    list.find('li:eq(0)').addClass('active');

                }
               
                function montaLi(classIcon, paginaAtual) {
                    list.append($('<li/>').addClass('page-item').append($('<a>').addClass('page-link').attr('href', 'javascript:void(0)').html('<span class="fa {0}" aria-hidden="true"></span>'.format(classIcon)))
                                  .click(function () {
                                      currentPage = paginaAtual;
                                      navigate(paginaAtual);
                                  }));

                }

                function navigate(topage) {
                    //make sure the page in between min and max page count
                    var index = topage;
                    var mid = settings.length / 2;
                    if (settings.length % 2 > 0) mid = (settings.length + 1) / 2;
                    var startIndex = 0;
                    if (topage >= 0 && topage < totalpages) {
                        if (topage >= mid) {
                            if (totalpages - topage > mid)
                                startIndex = topage - (mid - 1);
                            else if (totalpages > settings.length)
                                startIndex = totalpages - settings.length;
                        }
                        buildNavigation(startIndex); //showLabels(currentPage);
                        list.find('li').removeClass('active');
                        // inputPage.val(currentPage + 1);
                        list.find('li[id="' + (index + 1) + '"]').addClass('active');
                        var recordStartIndex = currentPage * settings.recordsperpage;
                        var recordsEndIndex = recordStartIndex + settings.recordsperpage;
                        if (recordsEndIndex > settings.totalrecords)
                            recordsEndIndex = settings.totalrecords % recordsEndIndex;
                        if (initialized) {
                            if (settings.onchange != null) {
                                settings.onchange((currentPage + 1), recordStartIndex, recordsEndIndex);
                            }
                        }
                        if (dataContainer != null) {
                            if (dataContainer.length > 0) {
                                //hide all elements first
                                dataElements.css('display', 'none');
                                //display elements that need to be displayed
                                if ($(dataElements[0]).find('th').length > 0) { //if there is a header, keep it visible always
                                    $(dataElements[0]).css('display', '');
                                    recordStartIndex++;
                                    recordsEndIndex++;
                                }
                                for (var i = recordStartIndex; i < recordsEndIndex; i++)
                                    $(dataElements[i]).css('display', '');
                            }
                        }
                        $('[data-toggle="tooltip"]').tooltip();
                        
                    }
                }

            });

        }


    });
})(jQuery);