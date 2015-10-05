(function() {

    // Configs:
    var selectorForCheckboxes = 'input[type="checkbox"].indeterminate-checkbox',
        stepsFromCheckboxToContainer = 1,
        stepsFromContainerToParentContainer = 2;


    var IndeterminateCheckbox = {
        init: function() {
            // Hook the onchange event for all checkboxes of the appropriate class
            $(selectorForCheckboxes).change(function(e) {
                var checkStateOfTarget = $(this).prop("checked"),
                    container = getListItemContainingCheckbox($(this));

                markAnyChildrenToShareTheCheckStateOfTarget(container, checkStateOfTarget);
                checkRelatives(container);

                /**
                 * This recursion based function will check if the siblings of el
                 * all match the entering target checkbox's state, and when they do
                 * it set's the parent's check state accordingly...
                 * Then it bubbles up to the parent's tier until it reaches a point
                 * of bubbling where the el is NOT an LI element.
                 *
                 * el should be a container for an input[type=checkbox] (eg li)
                 *
                 * @param {Element} el
                 */
                function checkRelatives(el) {
                    // Prevent bubbling up beyond the checkbox tree
                    if (el.prop("tagName") != "LI") return;

                    // should be an li element (hosting not only a checkbox, but also
                    // a ul of li's, each li containing checkboxes
                    var parent = getParentOfCurrentContainer(el);
                    var doTargetSiblingsOrParentSiblingsMatchTargetCheckState = checkIfSiblingsToEitherTargetOrParentsAreTheSameCheckStateAsTarget(el);

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



                    /**
                     * Returns true if all the siblings of the specified element
                     * (either target or one of it's direct anncestors) are of
                     * the same checkstate as the target checkbox originally
                     * clicked.
                     *
                     * @return {boolean}
                     */
                    function allSiblingsOfThisTierAreChecked() {
                        return (doTargetSiblingsOrParentSiblingsMatchTargetCheckState && checkStateOfTarget);
                    }

                    /**
                     * Returns true if all the siblings of the specified element
                     * (either target or one of it's direct anncestors) are of a
                     * differing checkstate from the target originally clicked.
                     *
                     * @return {boolean}
                     */
                    function allCheckboxesOfThisTierAreUnchecked() {
                        return (doTargetSiblingsOrParentSiblingsMatchTargetCheckState && !checkStateOfTarget);
                    }

                    /**
                     * Iterates over each of elContainer's siblings and if one
                     * contains a checkstate that differs from the originating
                     * checkbox's state, the function will return false.
                     * Else returns true.
                     *
                     * @param {Element} elContainer
                     * @return {boolean} doTargetSiblingsOrParentSiblingsMatchTargetCheckState
                     */
                    function checkIfSiblingsToEitherTargetOrParentsAreTheSameCheckStateAsTarget(elContainer) {
                        var doTargetSiblingsOrParentSiblingsMatchTargetCheckState = true;

                        elContainer.siblings().each(function() {
                            doTargetSiblingsOrParentSiblingsMatchTargetCheckState =
                              ($(this).children(selectorForCheckboxes).prop("checked") === checkStateOfTarget);
                              //($(this).children(selectorForCheckboxes).prop("checked") === checkStateOfTarget);
                        });

                        return doTargetSiblingsOrParentSiblingsMatchTargetCheckState;
                    }

                }


                /**
                 * Marks all the children of the elContainer containing the
                 * children of the originally clicked checkbox to share the
                 * the state of the originally clicked checkbox.
                 *
                 * @param {Element} elContainer
                 * @param {Element} checkStateOfTarget
                 */
                function markAnyChildrenToShareTheCheckStateOfTarget(elContainer, checkStateOfTarget) {
                    elContainer.find(selectorForCheckboxes).prop({
                        indeterminate: false,
                        checked: checkStateOfTarget
                    });
                }

                /**
                 * Set any direct ancestor checkboxes of elContainer to an
                 * indeterminate state.
                 *
                 * When Andre is un-ticked, the first occurance of this el is
                 * the li container to Andre's textbox/ label.  The
                 * parents("li") are actually the containers to Giants and Tall
                 * Things
                 *
                 * @param {Element} elContainer
                 */
                function markAllDirectAncestorsAsIndeterminate(elContainer) {
                    elContainer.parents("li").children(selectorForCheckboxes).prop({
                        indeterminate: true,
                        checked: false
                    });
                }

                function markTheParentOfThisTierUncheckedOrIndeterminate(parent) {
                    parent.children(selectorForCheckboxes).prop({
                        checked: false,
                        indeterminate: (parent.find(selectorForCheckboxes + ':checked').length > 0)
                    });
                }

                // parent should be an li, containing a checkbox.
                function markTheParentOfThisTierChecked(parent) {
                    parent.children(selectorForCheckboxes).prop({
                        indeterminate: false,
                        checked: true
                    });
                }

                /**
                 * This helper function is used for going from, say, a checkbox
                 * to it's container.  Or from it's container, to the next up
                 * container.
                 *
                 * @param {Element} startingEl
                 * @param {int} steps
                 */
                function traverseDOMUpwards(startingEl, steps) {
                    var el = startingEl;

                    for (var i = 0; i < steps; i++)
                        el = el.parent();

                    return el;
                }

                function getParentOfCurrentContainer(container) {
                    return traverseDOMUpwards(container, stepsFromContainerToParentContainer);
                }

                function getListItemContainingCheckbox(checkboxEl) {
                    return traverseDOMUpwards(checkboxEl, stepsFromCheckboxToContainer);
                }

                /**
                 *
                 *
                 * @return {Element}
                 */
                function getCheckboxOfContainer(elContainer) {
                    // elContainer.
                }


            });
        }
    };

    window.IndeterminateCheckbox = IndeterminateCheckbox;
})();
