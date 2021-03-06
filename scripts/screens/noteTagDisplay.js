/**
* Tag Display for a note.  Read only.
*
* @class MobileNotes.NoteTagDisplay
* @extends AFrame.Display
* @constructor
*/
/**
* The list to where the tags are found
* @config list
* @type {AFrame.List}
*/
/**
* The note data source where to get the list of note ids
* @config dataSource
* @type {AFrame.Model}
*/
MobileNotes.NoteTagDisplay = (function() {
    "use strict";
    
    var Display = AFrame.Class( AFrame.Display, {
        init: function( config ) {
            this.import( config, 'list', 'dataSource' );

            Display.sc.init.call( this, config );
        },
        
        bindEvents: function() {
            this.list.bindEvent( 'onInsertElement', onRowInsert, this );
            
            this.bindClick( '#btnNewTag', onNewTag );
            
            this.dataSource.bindEvent( 'onSet-tag_ids', onTagsChange, this );
        }
    } );
    
    function onNewTag( event ) {
        event.stopImmediatePropagation();
        
        this.updateList = true;

        var val = $( '#newtagname' ).val();
        
        if( val ) {
            this.triggerEvent( {
                type: 'newtag',
                name: val
            } );
        }
    }

    function onRowInsert( event ) {
        var element = event.rowElement;
        
        $( 'input', element ).checkboxradio( { theme: 'c' } );
        
        if( this.updateList ) {
            this.getTarget().find( '[data-role=controlgroup]' ).controlgroup('refresh');
            this.updateList = false;
        }

        this.bindDOMEvent( $( 'label', element ), 'click', onLabelClick );
    }
    
    function onLabelClick( event ) {
        var input = $( event.currentTarget ).siblings( 'input[type=checkbox]' );
        var tagID = input.attr( 'id' );
        var checked = !!input.attr( 'checked' );
        
        var tagIDs = this.dataSource.get( 'tag_ids' ) || [];

        var func = checked ? addTag : removeTag;
        var changed = func.call( this, tagID, tagIDs );

        if( changed ) {
            this.dataSource.set( 'tag_ids', tagIDs );
        }
    }
    
    function onTagsChange( event ) {
        var target = this.getTarget();
        
        $( 'input[type=checkbox]', target ).removeAttr( 'checked' ).checkboxradio( "refresh" );
        
        var tagIDs = event.value || [];
        tagIDs.forEach( function( tagID ) {
            $( '#' + tagID, target ).attr( 'checked', 'checked' ).checkboxradio( "refresh" );
        } );
    }
    
    function addTag( tagID, tagIDs ) {
        var index = tagIDs.indexOf( tagID );
        if( -1 == index ) {
            tagIDs.push( tagID );
            return true;
        }
    }
    
    function removeTag( tagID, tagIDs ) {
        var index = tagIDs.indexOf( tagID );
        if( -1 != index ) {
            tagIDs.splice( index, 1 );
            return true;
        }
    }
    
    return Display;
}() );