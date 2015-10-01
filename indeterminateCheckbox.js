$(function() {
    // Hook the onchange event for all checkboxes of the appropriate class
    $('input[type="checkbox"]').change(function(e) {
        var checkStateOfTarget = $(this).prop("checked"),
            container = getListItemContainingCheckbox($(this));

        markAnyChildrenToShareTheCheckStateOfTarget(container, checkStateOfTarget);

        checkRelatives(container);

        // Closures:  checked,
        //
        function checkRelatives(el) {
            var parent = el.parent().parent();

            var doTargetOrParentSiblingsMatchTargetCheckState = checkIfSiblingsToTargetOrParentsAreTheSameCheckStateAsTarget(el);

            if (allCheckboxesOfThisTierAreChecked()) {
                parent.children('input[type="checkbox"]').prop({
                    indeterminate: false,
                    checked: checkStateOfTarget
                });
                checkRelatives(parent);
            } else if (allCheckboxesOfThisTierAreUnchecked()) {
                parent.children('input[type="checkbox"]').prop("checked", checkStateOfTarget);
                parent.children('input[type="checkbox"]').prop("indeterminate", (parent.find('input[type="checkbox"]:checked').length > 0));
                checkRelatives(parent);
            } else { // the checkboxes of this tier are mix and matched
                console.log("mix matched");
                el.parents("li").children('input[type="checkbox"]').prop({
                    indeterminate: true,
                    checked: false
                });
            }


            function allCheckboxesOfThisTierAreChecked() {
                return (doTargetOrParentSiblingsMatchTargetCheckState && checkStateOfTarget);
            }

            function allCheckboxesOfThisTierAreUnchecked() {
                return (doTargetOrParentSiblingsMatchTargetCheckState && !checkStateOfTarget);
            }

            function checkIfSiblingsToTargetOrParentsAreTheSameCheckStateAsTarget(el) {
                var doTargetOrParentSiblingsMatchTargetCheckState = true;

                el.siblings().each(function() {
                    doTargetOrParentSiblingsMatchTargetCheckState = ($(this).children('input[type="checkbox"]').prop("checked") === checkStateOfTarget);
                });

                return doTargetOrParentSiblingsMatchTargetCheckState;
            }

        }




        function getListItemContainingCheckbox(checkboxEl) {
            return checkboxEl.parent();
        }

        // make sure none of the children of this checkbox are set to indeterminate
        // And mark all the children checked, since their parent has been marked thus
        function markAnyChildrenToShareTheCheckStateOfTarget(container, checkStateOfTarget) {
            container.find('input[type="checkbox"]').prop({
                indeterminate: false,
                checked: checkStateOfTarget
            });
        }





    });
});
