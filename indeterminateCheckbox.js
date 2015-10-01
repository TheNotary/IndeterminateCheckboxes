$(function() {
    // Hook the onchange event for all checkboxes of the appropriate class
    $('input[type="checkbox"]').change(function(e) {
        var checkStateOfTarget = $(this).prop("checked"),
            container = getListItemContainingCheckbox($(this));

        markAnyChildrenToShareTheCheckStateOfTarget(container, checkStateOfTarget);
        checkRelatives(container);

        // This recursion based function will check if the siblings of el
        // all match the entering target checkbox's state, and when they do
        // it set's the parent's check state accordingly...
        // Then it bubbles up to the parent's tier until it reaches a point
        // of bubbling where the el is NOT an LI element.
        //
        // el should be a container for an inputbox (li)
        function checkRelatives(el) {
            // Prevent bubbling up beyond the treeview
            if (el.prop("tagName") != "LI") return;

            var parent = el.parent().parent();
            var doTargetSiblingsOrParentSiblingsMatchTargetCheckState = checkIfSiblingsToTargetOrParentsAreTheSameCheckStateAsTarget(el);

            if (allSiblingsOfThisTierAreChecked()) {
                markTheParentOfThisTierChecked(parent);
                checkRelatives(parent);
            }
            else if (allCheckboxesOfThisTierAreUnchecked()) {
                markTheParentOfThisTierUncheckedOrIndeterminate(parent);
                checkRelatives(parent);
            }
            // The checkboxes of this tier are mix and matched, therefore
            // we need to go up to every direct ancestor of this tier and set indeterminate
            else {
                markAllDirectAncestorsAsIndeterminate(el);
            }

            // /End confusing recursive logic

            // returns true if all the siblings of the specified element are of
            // the same checkstate as the target originally clicked
            function allSiblingsOfThisTierAreChecked() {
                return (doTargetSiblingsOrParentSiblingsMatchTargetCheckState && checkStateOfTarget);
            }

            function allCheckboxesOfThisTierAreUnchecked() {
                return (doTargetSiblingsOrParentSiblingsMatchTargetCheckState && !checkStateOfTarget);
            }

            function checkIfSiblingsToTargetOrParentsAreTheSameCheckStateAsTarget(el) {
                var doTargetSiblingsOrParentSiblingsMatchTargetCheckState = true;

                el.siblings().each(function() {
                    doTargetSiblingsOrParentSiblingsMatchTargetCheckState = ($(this).children('input[type="checkbox"]').prop("checked") === checkStateOfTarget);
                });

                return doTargetSiblingsOrParentSiblingsMatchTargetCheckState;
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

        // When Andre is un-ticked, the first occurance of this el is
        // the li container to Andre's textbox/ label.
        // The parents("li") are actually the containers to Giants and Tall Things
        // So this sets the direct ancestors to an indeterminate state
        function markAllDirectAncestorsAsIndeterminate(elContainer) {
            elContainer.parents("li").children('input[type="checkbox"]').prop({
                indeterminate: true,
                checked: false
            });
        }

        function markTheParentOfThisTierUncheckedOrIndeterminate(parent) {
            parent.children('input[type="checkbox"]').prop({
                checked: false,
                indeterminate: (parent.find('input[type="checkbox"]:checked').length > 0)
            });
        }

        function markTheParentOfThisTierChecked(parent) {
            parent.children('input[type="checkbox"]').prop({
                indeterminate: false,
                checked: true
            });
        }


    });
});
