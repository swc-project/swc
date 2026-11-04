
            function Set() {}
            function useSelection(selectionType, derivedHalfSelectedKeys) {
                return selectionType === 'radio'
                    ? new Set()
                    : new Set(derivedHalfSelectedKeys);
            }
            